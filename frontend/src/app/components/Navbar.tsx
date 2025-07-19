"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#202020]">
      <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="hover:underline p-3 text-lg text-background"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={55}
                height={55}
                className="object-cover"
              />
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 text-lg text-background">
            <Link href="/upload" className="hover:underline p-3">
              Create New Insights
            </Link>
            <Link href="/gallery" className="hover:underline p-3">
              Gallery
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="focus:outline-none bg-background"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-xl text-background bg-foreground">
          <Link href="/upload" className="block border-b hover:underline">
            Create New Insights
          </Link>
          <Link href="/gallery" className="block border-b hover:underline">
            Gallery
          </Link>
        </div>
      )}
    </nav>
  );
}
