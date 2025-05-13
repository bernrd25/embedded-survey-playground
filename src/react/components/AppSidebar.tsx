import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./Sidebar";
import { useEffect } from "react";
import { scriptInjector } from "@lib/scriptInjector";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/embedded-survey-playground/apps",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/embedded-survey-playground/apps/inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/embedded-survey-playground/apps/calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/embedded-survey-playground/apps/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/embedded-survey-playground/apps/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
