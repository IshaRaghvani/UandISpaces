"use client";
import { SignedIn } from "@clerk/nextjs";
import React from "react";
import SideNav from "./_components/SideNav";
import { Toaster } from "@/components/ui/toaster";

function DashboardLayout({ children }) {
  return (
    <SignedIn>
      <div>
        <div className="md:w-52 fixed md:block">
          <SideNav />
        </div>
        <div className="md:ml-52">
          {children} {/* Render child components */}
        </div>
        <Toaster />
      </div>
    </SignedIn>
  );
}

export default DashboardLayout;
