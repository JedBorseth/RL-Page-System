"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "~/components/nav-main";
import { NavProjects } from "~/components/nav-projects";
import { NavUser } from "~/components/nav-user";
import { TeamSwitcher } from "~/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "~/components/ui/sidebar";
import Image from "next/image";
import { useSession } from "next-auth/react";

const data = {
  user: {},
  navMain: [
    {
      title: "Main Machines",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "Rotary Die Cutter",
          url: "/machines/rotary-die-cutter",
        },
        {
          title: "Langston",
          url: "/machines/langston",
        },
        {
          title: "AOPack",
          url: "/machines/box-machine",
        },
        {
          title: "Guillotine",
          url: "/machines/guillotine",
        },
        {
          title: "Hand Fed Die Cutter",
          url: "/machines/hand-fed-die-cutter",
        },
        {
          title: "Gluing",
          url: "/machines/gluing",
        },
      ],
    },
    {
      title: "Annex",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Jumbo",
          url: "/machines/jumbo",
        },
        {
          title: "Gluing",
          url: "/machines/annex-gluing",
        },
        {
          title: "Other Things?",
          url: "#",
        },
      ],
    },

    {
      title: "Forklift",
      url: "#",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "Dashboard",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Trello",
      url: "https://trello.com/b/ygNgDkLo",
      icon: Frame,
    },
    {
      name: "Office 365",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Teams",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = useSession();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Image src="/logo.png" alt="Logo" width={32} height={32} />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">R&L Packaging</span>
            <span className="truncate text-xs">Forklift HUD</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={session.data?.user ?? { id: "", name: "", email: "" }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
