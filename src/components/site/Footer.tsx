import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Clock, Youtube } from "lucide-react";
import { useSiteBusiness } from "@/lib/use-site-business";

export function Footer() {
  const business = useSiteBusiness();
  return (
    <footer className="mt-20 border-t border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-display text-xl font-bold">W</div>
              <div className="leading-tight">
                <div className="font-display font-bold tracking-wide">WAYNE <span className="text-primary">AUTO</span></div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Recyclers LLC</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Michigan&apos;s trusted junk car buyers and automotive recyclers. We pay top-dollar cash for unwanted, damaged, and scrap vehicles — with same-day free towing across Wayne County and Metro Detroit.
            </p>
            <div className="mt-4 flex gap-2">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a key={i} href="#" aria-label="Social link" className="h-9 w-9 grid place-items-center rounded-md border border-border hover:border-primary hover:text-primary transition-colors">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/sell-your-junk-car" className="hover:text-primary">Sell Your Junk Car</Link></li>
              <li><Link to="/junk-car-removal" className="hover:text-primary">Free Junk Car Removal</Link></li>
              <li><Link to="/auto-recycling-services" className="hover:text-primary">Auto Recycling Services</Link></li>
              <li><Link to="/used-auto-parts" className="hover:text-primary">Used Auto Parts Michigan</Link></li>
              <li><Link to="/areas-we-serve" className="hover:text-primary">Areas We Serve</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-primary">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
              <li><a href="/sitemap.xml" className="hover:text-primary">Sitemap</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-foreground mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{business.address.full}</span></li>
              <li className="flex gap-2"><Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  <a href={business.primaryPhoneHref} className="block hover:text-primary">{business.phones[0]}</a>
                  {business.secondaryPhoneHref && business.phones[1] ? (
                    <a href={business.secondaryPhoneHref} className="block hover:text-primary">{business.phones[1]}</a>
                  ) : null}
                </span>
              </li>
              <li className="flex gap-2"><Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" /><a href={`mailto:${business.email}`} className="hover:text-primary">{business.email}</a></li>
              <li className="flex gap-2"><Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" /><span>{business.hours}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed max-w-5xl">
            <strong className="text-foreground/80">Wayne Automotive Recyclers LLC</strong> is a licensed Michigan automotive recycling company offering cash for junk cars, scrap car removal, and certified used auto parts. We buy junk cars, damaged cars, wrecked vehicles, non-running cars, and unwanted vehicles across Wayne, Westland, Livonia, Dearborn, Detroit, and all of Metro Detroit. Free towing, instant quotes, and same-day pickup — the easiest way to sell your junk car in Michigan.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3 text-xs text-muted-foreground">
            <span>© {new Date().getFullYear()} Wayne Automotive Recyclers LLC. All rights reserved.</span>
            <span>Licensed Michigan Auto Recycler</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
