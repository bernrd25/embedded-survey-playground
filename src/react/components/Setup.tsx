import React from "react";
import { FloatingDock } from "./FloatingDock";
import { Home, Settings, Terminal } from "lucide-react";
import { time } from "motion";
import { title } from "motion/react-client";

const Setup = () => {
  const links = [
    {
      title: "Settings",
      icon: (
        <Settings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },

    {
      title: "Products",
      icon: (
        <Terminal className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "#",
    },
  ];
  return (
    <div className="fixed bottom-10 left-1 z-50 flex w-sm items-center justify-center bg-transparent">
      <FloatingDock items={links} />
    </div>
  );
};

export default Setup;
