/**
 * EmbedFrame - Secure YouTube embed wrapper
 *
 * Includes proper security attributes and lazy loading.
 */

interface EmbedFrameProps {
  src: string;
  title: string;
  className?: string;
  aspectRatio?: "16/9" | "4/3" | "1/1";
}

export function EmbedFrame({ src, title, className = "", aspectRatio = "16/9" }: EmbedFrameProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-black/20 ${className}`}
      style={{ aspectRatio }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
}
