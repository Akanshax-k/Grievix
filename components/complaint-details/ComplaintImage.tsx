import Image from "next/image";

interface ComplaintImageProps {
  src: string;
  alt: string;
}

export default function ComplaintImage({ src, alt }: ComplaintImageProps) {
  return (
    <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  );
}