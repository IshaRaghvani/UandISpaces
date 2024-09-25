import { AlignJustify, LayoutDashboard, LayoutIcon, PersonStandingIcon, Settings, UsersRound } from "lucide-react";
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
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      id: 2,
      name: 'Leads',
      icon: UsersRound,
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
    <div className="border bg-gray-300 rounded-lg shadow-md h-screen justify-center items-center p-4 m-4">
      <div className="flex flex-row items-center gap-6">
      <Image
        src={'/Group15.svg'}
        alt="U&ISpaces Logo"
        width={100}
        height={60}
        className="bg-transparent m-6 items-center" 
      />
      {/* <AlignJustify /> */}
      </div>
      <hr className="my-5" />
      {
        menuList.map((menu) => (
          <Link key={menu.id} href={menu.path}>
            <h3 className={`flex items-center gap-3 text-sm p-3
              text-slate-500 hover:bg-blue-500 my-1
              hover:text-white cursor-pointer rounded-lg ${path==menu.path&& 'bg-blue-500 text-white'}`}
              >
              <menu.icon size={20}/>
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
