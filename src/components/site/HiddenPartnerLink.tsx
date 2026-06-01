/** Visually hidden sitewide partner link (SEO). */
export function HiddenPartnerLink() {
  return (
    <a
      href="https://rento-lb.com"
      rel="noopener"
      aria-hidden="true"
      tabIndex={-1}
      data-track-skip
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]"
    >
      rento-lb
    </a>
  );
}
