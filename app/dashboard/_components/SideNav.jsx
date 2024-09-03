import { LayoutIcon, PersonStandingIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";  // Import Link from next/link
import React from "react";
import { useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
function SideNav() {
  const { user, isSignedIn } = useUser();
  
  const menuList = [
    {
      id: 1,
      name: 'Dashboard',
      icon: LayoutIcon,
      path: '/dashboard'
    },
    {
      id: 2,
      name: 'Leads',
      icon: PersonStandingIcon,
      path: '/dashboard/leads'
    },
    {
      id: 3,
      name: 'Settings',
      icon: Settings,
      path: '/dashboard/settings'
    },
  ];

  const path = usePathname();
  useEffect(()=>{
    console.log(path);
  })

  return (
    <div className="border rounded-lg shadow-md h-screen p-4 m-2">
      <Image
        src={'/uandispaceslogo.png'}
        alt="U&ISpaces Logo"
        width={140}
        height={80}
      />
      <hr className="my-5" />
      {
        menuList.map((menu) => (
          <Link key={menu.id} href={menu.path}>
            <h3 className={`flex items-center gap-3 text-md p-2
              text-slate-500 hover:bg-red-500 my-2
              hover:text-white cursor-pointer rounded-lg ${path==menu.path&& 'bg-red-500 text-white'}`}
              >
              <menu.icon />
              {menu.name}
            </h3>
          </Link>
        ))
      }
      {isSignedIn && user && (
        <div className="mt-5">
          
        </div>
      )}
    </div>
  );
}

export default SideNav;
