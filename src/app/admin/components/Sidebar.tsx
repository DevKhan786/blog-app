import { Gauge, Layers2, LayoutList, User } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  const links = [
    {
      name: "Dashboard",
      path: "/admin/",
      icon: <Gauge className="w-4 h-4 md:w-8 md:h-8" />,
    },
    {
      name: "Posts",
      path: "/admin/posts",
      icon: <LayoutList className="w-4 h-4 md:w-8 md:h-8" />,
    },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <Layers2 className="w-4 h-4 md:w-8 md:h-8" />,
    },
    {
      name: "Authors",
      path: "/admin/authors",
      icon: <User className="w-4 h-4 md:w-8 md:h-8" />,
    },
  ];

  return (
    <nav className="w-16 md:w-38 h-screen border-r border-gray-400 sticky top-0 bg-white">
      <ul className="flex flex-col gap-4 p-2">
        {links.map(({ name, path, icon }) => (
          <li key={name}>
            <Link
              href={path}
              className="flex mt-4 items-center gap-2 p-2 rounded-lg 
                        transition-all active:scale-95
                       group  bg-black text-white hover:bg-indigo-700 duration-300 ease-in-out"
            >
              <span className="">{icon}</span>
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
