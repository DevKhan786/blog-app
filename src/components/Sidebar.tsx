import { Gauge, Layers2, LayoutList, User } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/admin/",
      icon: <Gauge className="w-4 h-4 md:w-6 md:h-6 text-indigo-400" />,
    },
    {
      name: "Posts",
      path: "/admin/posts",
      icon: <LayoutList className="w-4 h-4 md:w-6 md:h-6 text-indigo-400" />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <Layers2 className="w-4 h-4 md:w-6 md:h-6 text-indigo-400" />,
    },
    {
      name: "Authors",
      path: "/admin/authors",
      icon: <User className="w-4 h-4 md:w-6 md:h-6 text-indigo-400" />,
    },
  ];

  return (
    <nav className="w-16 md:w-40 h-screen border-r border-zinc-800 sticky top-0 bg-black">
      <div className="p-3 md:p-4 border-b border-zinc-800">
        <h2 className="text-xs md:text-sm font-bold text-white hidden md:block">
          Admin Dashboard
        </h2>
        <p className="text-xs text-indigo-400 hidden md:block">
          Manage your blog
        </p>
      </div>
      <ul className="flex flex-col gap-2 p-2">
        {links.map(({ name, path, icon }) => (
          <li key={name}>
            <Link
              href={path}
              className="flex mt-2 items-center gap-2 p-2 rounded-lg 
                        transition-all active:scale-95
                        bg-zinc-900 text-white hover:bg-indigo-600 
                        duration-300 ease-in-out border border-zinc-800"
            >
              <span>{icon}</span>
              <span className="hidden md:inline text-xs font-medium">
                {name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
