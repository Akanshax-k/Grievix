import exifr from "exifr";

export interface ImageVerification {
  hasExif: boolean;
  hasGps: boolean;
  gps: { lat: number; lng: number } | null;
  locationSource: "exif" | "gps" | "manual";
  hasTimestamp: boolean;
  takenAt: Date | null;
  ageInHours: number | null;
  cameraMake: string | null;
  cameraModel: string | null;
  trustLevel: "high" | "medium" | "low";
  warnings: string[];
  isFreshCapture: boolean;
}

const MAX_FRESH_HOURS = 48;

/**
 * Check if the file was just captured by the browser camera.
 * Browser camera captures have lastModified within a few seconds of now.
 */
function isFreshBrowserCapture(file: File): boolean {
  const ageMs = Date.now() - file.lastModified;
  // If file was created less than 60 seconds ago, it's a live camera capture
  return ageMs >= 0 && ageMs < 60_000;
}

/**
 * Detect if the image was shared via a messaging app (WhatsApp, Telegram, etc.)
 * These apps strip EXIF metadata for privacy, so the image loses all proof.
 */
function detectMessagingApp(file: File): string | null {
  const name = file.name.toLowerCase();

  // WhatsApp: IMG-20250219-WA0001.jpg or WhatsApp Image 2025-02-19
  if (/img-\d{8}-wa\d+/i.test(name) || name.includes("whatsapp")) return "WhatsApp";
  // Telegram: photo_2025-02-19_12-30-45.jpg
  if (/photo_\d{4}-\d{2}-\d{2}/i.test(name) || name.includes("telegram")) return "Telegram";
  // Signal: signal-2025-02-19-123045.jpg
  if (/signal-\d{4}-\d{2}-\d{2}/i.test(name)) return "Signal";
  // Facebook Messenger: received_123456789.jpeg
  if (/^received_\d+/i.test(name)) return "Messenger";
  // Instagram: typically has 'insta' in name
  if (name.includes("insta")) return "Instagram";

  return null;
}

export async function verifyImage(file: File): Promise<ImageVerification> {
  const freshCapture = isFreshBrowserCapture(file);

  const result: ImageVerification = {
    hasExif: false,
    hasGps: false,
    gps: null,
    locationSource: "manual",
    hasTimestamp: false,
    takenAt: null,
    ageInHours: null,
    cameraMake: null,
    cameraModel: null,
    trustLevel: "low",
    warnings: [],
    isFreshCapture: freshCapture,
  };

  try {
    // Parse ALL available EXIF — don't restrict with `pick` because
    // mobile browsers may use non-standard tag names
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exif = await exifr.parse(file, {
      gps: true,
      tiff: true,
      exif: true,
      ifd0: true,
    } as any);

    if (!exif) {
      // No EXIF at all — but if it was JUST captured by the browser camera,
      // that's still trustworthy (browsers strip EXIF on some Android devices)
      const messagingApp = detectMessagingApp(file);

      if (freshCapture) {
        result.warnings.push(
          "Photo was just captured but your browser stripped metadata. Location will use device GPS."
        );
        result.trustLevel = "medium";
      } else if (messagingApp) {
        result.warnings.push(
          `This image was shared via ${messagingApp}, which strips photo metadata for privacy. ` +
          `For higher trust, please upload the original photo from your gallery or take a new one directly.`
        );
      } else {
        result.warnings.push(
          "No metadata found — this image may have been downloaded or screenshot. " +
          "For best results, upload the original photo from your camera gallery."
        );
      }
      return result;
    }

    result.hasExif = true;

    // GPS
    try {
      const gps = await exifr.gps(file);
      if (gps?.latitude && gps?.longitude) {
        result.hasGps = true;
        result.gps = { lat: gps.latitude, lng: gps.longitude };
        result.locationSource = "gps";
      }
    } catch {
      // no gps
    }

    // Timestamp — check multiple possible tag names
    const rawDate =
      exif.DateTimeOriginal ??
      exif.CreateDate ??
      exif.DateTimeDigitized ??
      exif.DateTime ??
      exif.ModifyDate ??
      null;

    if (rawDate) {
      const d = rawDate instanceof Date ? rawDate : new Date(rawDate);
      if (!isNaN(d.getTime())) {
        result.hasTimestamp = true;
        result.takenAt = d;
        result.ageInHours = (Date.now() - d.getTime()) / (1000 * 60 * 60);
      }
    }

    // Camera — check multiple possible tag names
    result.cameraMake = exif.Make ?? exif.make ?? null;
    result.cameraModel = exif.Model ?? exif.model ?? null;

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

    if (!result.hasTimestamp && !freshCapture) {
      const messagingApp = detectMessagingApp(file);
      if (messagingApp) {
        result.warnings.push(
          `Timestamp stripped by ${messagingApp}. Upload the original from your gallery for better verification.`
        );
      } else {
        result.warnings.push(
          "No capture timestamp found. Cannot verify when this photo was taken."
        );
      }
    }

    const software = exif.Software ?? exif.software ?? null;
    if (software) {
      const sw = String(software).toLowerCase();
      const editors = ["photoshop", "gimp", "lightroom", "canva", "paint", "snapseed"];
      if (editors.some((e) => sw.includes(e))) {
        result.warnings.push(
          `Photo appears edited with "${software}".`
        );
      }
    }

    // ── Trust level ──
    if (
      result.hasGps &&
      result.hasTimestamp &&
      result.ageInHours !== null &&
      result.ageInHours <= MAX_FRESH_HOURS &&
      result.ageInHours >= 0
    ) {
      // Full EXIF with GPS + fresh timestamp = high trust
      result.trustLevel = "high";
    } else if (freshCapture) {
      // Just captured by the browser camera — trust it even with partial EXIF
      result.trustLevel = result.hasGps ? "high" : "medium";
    } else if (result.hasExif && (result.hasGps || result.hasTimestamp)) {
      result.trustLevel = "medium";
    } else {
      result.trustLevel = "low";
    }
  } catch {
    // EXIF parsing failed entirely
    if (freshCapture) {
      result.warnings.push(
        "Could not read metadata, but photo was just captured from your camera."
      );
      result.trustLevel = "medium";
    } else {
      result.warnings.push(
        "Could not read image metadata. This image may have been downloaded."
      );
    }
  }

  return result;
}
