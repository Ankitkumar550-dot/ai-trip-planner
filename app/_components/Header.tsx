"use client";

import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const menuOptions = [
  { name: "Home", path: "/" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact Us", path: "/contact-us" },
];

function Header() {
  const { user } = useUser();
  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-white/70 dark:bg-neutral-900/70 border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <div className="flex gap-2 items-center group">
          <Image src="/logo.svg" alt="logo" width={35} height={35} />
          <h2 className="font-extrabold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI Trip Planner
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {menuOptions.map((menu, index) => (
            <Link
              key={index}
              href={menu.path}
              className="relative text-gray-800 dark:text-gray-200 font-medium group"
            >
              {menu.name}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
        {/* Get started button */}
        <div className="flex gap-5 items-center">
          {!user ? <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton> :

            <Link href={'/create-new-trip'}>
              <Button>Create New Trip</Button>
            </Link>}
          <UserButton />
        </div>

      </div>
    </header>
  );
}

export default Header;