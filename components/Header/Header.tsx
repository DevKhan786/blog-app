import { Home, LogIn, Newspaper } from "lucide-react";
import Link from "next/link";
import React from "react";

const NavLink = ({
  href,
  icon: Icon,
  children,
  className,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) => (
  <Link
    href={href}
    className={`flex items-center gap-2 text-gray-700 hover:bg-gray-200 transition-colors 
                px-4 py-2 rounded-lg group font-medium ${className || ""}`}
  >
    <Icon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
    <span>{children}</span>
  </Link>
);

const Header = () => {
  return (
    <header className="sticky  top-0 z-50 bg-white border-b border-black">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
        >
          Blog
        </Link>

        <div className="flex items-center space-x-4">
          <NavLink href="/" icon={Home}>
            Home
          </NavLink>
          <NavLink href="/blogs" icon={Newspaper}>
            Blogs
          </NavLink>
          <Link
            href="/login"
            className="flex items-center gap-2 bg-black text-white 
                       px-4 py-2 rounded-lg hover:bg-b transition-colors 
                       font-semibold"
          >
            <LogIn className="w-5 h-5" />
            Login
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
