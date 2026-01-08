/**
 * ReleaseCard - Display for a single release
 */

import type { ReleaseVM } from "../domain/types";
import { ExternalLink } from "./ExternalLink";

interface ReleaseCardProps {
  release: ReleaseVM;
  dict?: {
    listen?: string;
  };
}

export function ReleaseCard({ release, dict }: ReleaseCardProps) {
  const { title, releaseDateFormatted, label, url } = release;

  return (
    <div className="glass rounded-xl p-5 transition-all hover:bg-white/5">
      <div className="flex flex-col gap-3">
        {/* Release Date */}
        {releaseDateFormatted && (
          <span className="text-xs uppercase tracking-wider text-accent font-medium">
            {releaseDateFormatted}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>

        {/* Label */}
        {label && (
          <p className="text-sm text-muted-foreground">
            <span className="text-accent">💿</span> {label}
          </p>
        )}

        {/* Listen Link */}
        {url && (
          <div className="pt-2">
            <ExternalLink
              href={url}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 hover:bg-accent/20 rounded-lg text-sm font-medium text-accent"
            >
              {dict?.listen || "Listen"}
            </ExternalLink>
          </div>
        )}
      </div>
    </div>
  );
}
