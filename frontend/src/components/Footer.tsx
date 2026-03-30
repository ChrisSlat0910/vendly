import Link from "next/link";

const Footer = () => (
  <footer className="border-t border-border bg-background py-12">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <Link href="/" className="font-display text-xl font-bold">
            <span className="text-gradient">VENDLY</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            The most trusted community market to buy, sell, and trade unique items securely.
          </p>
        </div>
        {[
          { title: "Marketplace", links: ["Explore", "Categories", "Trending", "Sellers"] },
          { title: "Vendors", links: ["Forums", "Events", "Blog", "Join Us"] },
          { title: "Support", links: ["FAQ", "Safety", "Contact", "Policies"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 font-display text-sm font-semibold text-foreground">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
        © 2026 Vendly — All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
