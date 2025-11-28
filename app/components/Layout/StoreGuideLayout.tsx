import { HeroSection } from "@/components/sections/new-user-page/HeroSection";
import { TabNavigation } from "@/components/sections/new-user-page/TabNavigation";
import { useState } from "react";
import { Outlet } from "react-router";
export default function StoreGuide() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <TabNavigation />

      <Outlet />
    </div>
  );
}
