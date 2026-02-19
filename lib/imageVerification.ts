import exifr from "exifr";

export interface ImageVerification {
  hasExif: boolean;
  hasGps: boolean;
  gps: { lat: number; lng: number } | null;
  hasTimestamp: boolean;
  takenAt: Date | null;
  ageInHours: number | null;
  cameraMake: string | null;
  cameraModel: string | null;
  trustLevel: "high" | "medium" | "low";
  warnings: string[];
}

const MAX_FRESH_HOURS = 48;

export async function verifyImage(file: File): Promise<ImageVerification> {
  const result: ImageVerification = {
    hasExif: false,
    hasGps: false,
    gps: null,
    hasTimestamp: false,
    takenAt: null,
    ageInHours: null,
    cameraMake: null,
    cameraModel: null,
    trustLevel: "low",
    warnings: [],
  };

  try {
    const exif = await exifr.parse(file, {
      gps: true,
      pick: [
        "DateTimeOriginal",
        "CreateDate",
        "ModifyDate",
        "Make",
        "Model",
        "Software",
      ],
    });

    if (!exif) {
      result.warnings.push(
        "No metadata found — this image may have been downloaded from the internet."
      );
      return result;
    }

    result.hasExif = true;

    // GPS
    try {
      const gps = await exifr.gps(file);
      if (gps?.latitude && gps?.longitude) {
        result.hasGps = true;
        result.gps = { lat: gps.latitude, lng: gps.longitude };
      }
    } catch {
      // no gps
    }

    // Timestamp
    const rawDate =
      exif.DateTimeOriginal ?? exif.CreateDate ?? exif.ModifyDate ?? null;
    if (rawDate) {
      const d = rawDate instanceof Date ? rawDate : new Date(rawDate);
      if (!isNaN(d.getTime())) {
        result.hasTimestamp = true;
        result.takenAt = d;
        result.ageInHours = (Date.now() - d.getTime()) / (1000 * 60 * 60);
      }
    }

    // Camera
    result.cameraMake = exif.Make ?? null;
    result.cameraModel = exif.Model ?? null;

    // Warnings
    if (!result.hasGps) {
      result.warnings.push(
        "Photo has no embedded GPS. Your current device location will be used instead."
      );
    }

    if (result.hasTimestamp && result.ageInHours !== null) {
      if (result.ageInHours > MAX_FRESH_HOURS) {
        const days = Math.floor(result.ageInHours / 24);
        result.warnings.push(
          `Photo was taken ${days > 0 ? `${days} day(s)` : "over 48 hours"} ago. Recent photos are preferred.`
        );
      }
      if (result.ageInHours < 0) {
        result.warnings.push(
          "Photo timestamp is in the future — device clock may be incorrect."
        );
      }
    }

    if (!result.hasTimestamp) {
      result.warnings.push(
        "No capture timestamp found. Cannot verify when this photo was taken."
      );
    }

    if (exif.Software) {
      const sw = String(exif.Software).toLowerCase();
      const editors = ["photoshop", "gimp", "lightroom", "canva", "paint", "snapseed"];
      if (editors.some((e) => sw.includes(e))) {
        result.warnings.push(
          `Photo appears edited with "${exif.Software}".`
        );
      }
    }

    // Trust level
    if (
      result.hasGps &&
      result.hasTimestamp &&
      result.ageInHours !== null &&
      result.ageInHours <= MAX_FRESH_HOURS &&
      result.ageInHours >= 0
    ) {
      result.trustLevel = "high";
    } else if (result.hasExif && (result.hasGps || result.hasTimestamp)) {
      result.trustLevel = "medium";
    } else {
      result.trustLevel = "low";
    }
  } catch {
    result.warnings.push(
      "Could not read image metadata. This image may have been downloaded."
    );
  }

  return result;
}
