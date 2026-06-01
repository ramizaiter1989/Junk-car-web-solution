import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { useSiteBusiness } from "@/lib/use-site-business";
import { useSiteConfig } from "@/lib/use-site-config";
import { trackCallAttrs } from "@/lib/website-tracking";
import { SiteLogo } from "@/components/site/SiteLogo";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/sell-your-junk-car", label: "Sell Your Car" },
  { to: "/junk-car-removal", label: "Removal" },
  { to: "/auto-recycling-services", label: "Recycling" },
  { to: "/used-auto-parts", label: "Used Parts" },
  { to: "/areas-we-serve", label: "Areas" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const business = useSiteBusiness();
  const site = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/85 border-b border-border shadow-lg"
          : "bg-background/40 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <SiteLogo className="group-hover:scale-105 transition-transform" />
            <div className="flex flex-col leading-tight">
              <span className="font-display font-bold text-base sm:text-lg tracking-wide">
                {site.isMichiganJunkCars ? (
                  <>
                    MICHIGAN <span className="text-primary">JUNK CARS</span>
                  </>
                ) : (
                  <>
                    WAYNE <span className="text-primary">AUTO</span>
                  </>
                )}
              </span>
              {!site.isMichiganJunkCars ? (
                <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Recyclers LLC
                </span>
              ) : null}
            </div>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary/60"
                activeProps={{ className: "text-primary !bg-secondary/40" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={business.primaryPhoneHref}
              {...trackCallAttrs("Header", business.primaryPhone)}
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/90 hover:scale-[1.02] transition-all"
            >
              <Phone className="h-4 w-4" />
              {business.primaryPhone}
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
              className="xl:hidden inline-flex items-center justify-center rounded-md border border-border bg-secondary/60 p-2 text-foreground hover:bg-secondary"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="xl:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="mx-auto max-w-7xl px-4 py-3 grid gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary"
                activeProps={{ className: "!text-primary bg-secondary" }}
              >
                {n.label}
              </Link>
            ))}
            <a
              href={business.primaryPhoneHref}
              {...trackCallAttrs("Mobile menu", business.primaryPhone)}
              className="sm:hidden mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-bold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> Call {business.primaryPhone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
