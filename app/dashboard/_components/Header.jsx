"use client";
import React from "react";

import Image from "next/image";


import { useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const { user, isSignedIn } = useUser();
  const path = usePathname();

  return (
    
      <div className="p-5 shadow-sm ">
        <div className="flex items-center justify-between">

          {isSignedIn ? (
            <div className="flex items-center gap-5">


              <UserButton />
            </div>
          ) : (
            <SignInButton>
              
            </SignInButton>
          )}
          
        </div>
        <hr className="my-4 border-gray-600"></hr>
      </div>
    
  );
}

export default Header;
