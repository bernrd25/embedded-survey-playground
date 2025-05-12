import React from "react";
import { FloatingDock } from "./FloatingDock";
import { Home, Settings, Terminal } from "lucide-react";
import { time } from "motion";
import { title } from "motion/react-client";
import { ModeToggle } from "./ModeToggle";

const Setup = () => {
  const clearLocalandSessionStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    console.log("Local and session storage cleared");
    window.location.reload();
  };
  const links = [
    {
      title: "Settings",
      icon: (
        <Settings className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => console.log("Settings"),
    },

    {
      title: "Home",
      icon: (
        <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/embedded-survey-playground",
    },

    {
      title: "Clear Storage",
      icon: (
        <Terminal className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      onClick: () => clearLocalandSessionStorage(),
    },
    {
      title: "Mode",
      icon: <ModeToggle />,
    },
  ];
  return (
    <div className="fixed bottom-10 left-1 z-50 flex w-sm items-center justify-center bg-transparent">
      <FloatingDock items={links} />
    </div>
  );
};

export default Setup;
