import { useSiteConfig } from "@/lib/use-site-config";
import { siteLogoPath } from "@/lib/site-branding";
import { cn } from "@/lib/utils";

type SiteLogoProps = {
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
};

export function SiteLogo({
  className,
  imageClassName,
  fallbackClassName,
}: SiteLogoProps) {
  const site = useSiteConfig();
  const logoPath = siteLogoPath(site);

  if (logoPath) {
    return (
      <img
        src={logoPath}
        alt=""
        width={40}
        height={40}
        className={cn(
          "h-10 w-10 rounded-md object-cover shadow-md shadow-primary/30",
          imageClassName,
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-xl font-bold shadow-md shadow-primary/30",
        fallbackClassName,
        className,
      )}
    >
      W
    </div>
  );
}
