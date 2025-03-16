"use client";
import React, { useState } from "react";
import {
  Home,
  Layers,
  LogIn,
  LogOut,
  Menu,
  Newspaper,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../lib/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BiCategory } from "react-icons/bi";

const NavLink = ({
  href,
  icon: Icon,
  children,
  className,
  onClick,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <Link
    href={href}
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                text-white bg-black transition-all duration-300 
                 active:scale-90 hover:bg-indigo-600 ease-in-out
                ${className || ""}`}
  >
    <Icon className="w-6 h-6 text-indigo-500" />
    <span>{children}</span>
  </Link>
);

const Header = () => {
  const { user, handleLogout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const hasPhoto = !!user?.photoURL;
  const hasName = !!user?.displayName;
  const photoURL = user?.photoURL || "";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        <Link
          href="/"
          className="text-2xl font-bold text-black hover:bg-gray-300  transition-all  py-2 px-4 rounded-2xl ease-in-out 
                     duration-300  active:scale-90"
        >
          FPSBLOGS
        </Link>

        <div className="md:hidden">
          <Button
            onClick={() => setMenuOpen(!menuOpen)}
            variant="ghost"
            className="p-1 hover:bg-transparent"
          >
            {menuOpen ? (
              <X className="w-8 h-8 text-black" />
            ) : (
              <Menu className="w-8 h-8 text-black" />
            )}
          </Button>
        </div>

        <div className="items-center space-x-4 hidden md:flex">
          <NavLink href="/" icon={Home}>
            Home
          </NavLink>
          <NavLink href="/blogs" icon={Layers}>
            Blogs
          </NavLink>
          <NavLink href="/categories" icon={BiCategory}>
            Categories
          </NavLink>
          {renderAuthSection()}
        </div>

        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b border-black md:hidden">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <NavLink href="/" icon={Home} onClick={() => setMenuOpen(false)}>
                Home
              </NavLink>
              <NavLink
                href="/blogs"
                icon={Newspaper}
                onClick={() => setMenuOpen(false)}
              >
                Blogs
              </NavLink>
              <NavLink
                href="/categories"
                icon={BiCategory}
                onClick={() => setMenuOpen(false)}
              >
                Categories
              </NavLink>

              <div className="mt-4 border-t pt-4">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full">
                      {hasPhoto ? (
                        <Image
                          className="rounded-full border-2 border-white"
                          width={36}
                          height={36}
                          src={photoURL}
                          alt="User profile"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-200 border-2 border-white">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <h1 className="text-sm font-bold uppercase">
                          {hasName ? user.displayName : "User"}
                        </h1>
                        <h1 className="text-xs opacity-75">{user.email}</h1>
                      </div>
                    </div>
                    {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
                      <div className="flex">
                        <Link
                          href="/admin"
                          className="flex w-full items-center justify-center gap-2 bg-red-500 
            px-4 py-2 rounded-lg font-bold transition-all text-black
            duration-300  active:scale-90 text-left hover:bg-indigo-600 ease-in-out"
                          onClick={() => setMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      </div>
                    )}
                    <Button
                      size="lg"
                      className="w-full bg-black text-white   active:scale-90 hover:bg-indigo-600 transition-all cursor-pointer ease-in-out duration-300"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-5 h-5 mr-2" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 bg-black text-white
                              px-4 py-2 rounded-lg font-semibold transition-all
                              duration-300  active:scale-90 text-left hover:bg-indigo-600 ease-in-out"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );

  function renderAuthSection() {
    return user ? (
      <div className="flex gap-4 items-center">
        <div className="flex items-center gap-2 bg-black hover:bg-indigo-600 duration-300 transition-all text-white py-1 px-4 rounded-full active:scale-90">
          {hasPhoto ? (
            <Image
              className="rounded-full border-2 border-white"
              width={36}
              height={36}
              src={photoURL}
              alt="User profile"
            />
          ) : (
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-indigo-200 border-2 border-white">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex flex-col mr-1">
            <h1 className="text-sm font-bold uppercase">
              {hasName ? user.displayName : "User"}
            </h1>
            <h1 className="text-xs opacity-75">{user.email}</h1>
          </div>
        </div>
        {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
          <div className="flex">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 bg-red-500 
            px-4 py-2 rounded-lg font-bold transition-all text-black
            duration-300  active:scale-90 text-left hover:bg-indigo-600 ease-in-out"
            >
              Admin Panel
            </Link>
          </div>
        )}
        <Button
          size="lg"
          className="bg-black text-white   active:scale-90 hover:bg-indigo-600 transition-all cursor-pointer ease-in-out duration-300"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Logout
        </Button>
      </div>
    ) : (
      <Link
        href="/login"
        className="flex items-center gap-2 bg-black text-white
                  px-4 py-2 rounded-lg font-semibold transition-all
                  duration-300  active:scale-90 text-left hover:bg-indigo-600 ease-in-out"
      >
        <LogIn className="w-5 h-5" />
        Login
      </Link>
    );
  }
};

export default Header;
