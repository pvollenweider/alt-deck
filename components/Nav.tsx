"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/deck", label: "DECK" },
  { href: "/generate", label: "GÉNÉRER" },
  { href: "/curate", label: "CURATION" },
  { href: "/session", label: "SESSION" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#ddd5cc] bg-[#faf7f4]" style={{ boxShadow: "0 0 18px rgba(0,0,0,0.07)" }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/logo.svg"
            alt="ALT-Sessions"
            width={100}
            height={36}
            className="block"
            priority
          />
          <span className="text-[#ddd5cc] select-none">—</span>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#6b6560]">
            DECK
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs tracking-widest px-5 py-2 uppercase font-medium transition-colors ${
                pathname === item.href
                  ? "text-[#b84a30] font-bold"
                  : "text-[#6b6560] hover:text-[#1a1a18]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
