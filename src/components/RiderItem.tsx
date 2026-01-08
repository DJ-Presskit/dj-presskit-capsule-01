/**
 * RiderItem - Display for a single technical rider item
 */

import type { RiderItemVM } from "../domain/types";

interface RiderItemProps {
  item: RiderItemVM;
}

export function RiderItem({ item }: RiderItemProps) {
  const { name, title, imageUrl, customTitle, note } = item;
  const displayTitle = customTitle || title || name;

  return (
    <div className="flex items-start gap-4 p-4 glass rounded-xl">
      {/* Image */}
      {imageUrl && (
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-black/20">
          <img
            src={imageUrl}
            alt={displayTitle}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-base">{displayTitle}</h4>
        {name && name !== displayTitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{name}</p>
        )}
        {note && <p className="text-sm text-muted-foreground/80 mt-2 italic">{note}</p>}
      </div>
    </div>
  );
}
