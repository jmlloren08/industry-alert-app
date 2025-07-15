import * as React from "react"
import {
    LayoutDashboard,
    ShieldAlert,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavPlatforms } from "@/components/nav-platforms"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"
import { SharedData } from "@/types"
import { ScrollArea } from "./ui/scroll-area"

const data = {
    teams: [
        {
            name: "Industry Alert App",
            logo: ShieldAlert,
            plan: "Raion Engineering Pty Ltd",
        },
    ],
    navMain: [
        {
            title: "Manage",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "Sources",
                    url: route('sources.index'),
                },
                {
                    title: "Regulations",
                    url: route('regulations.index'),
                },
                {
                    title: "Organizations",
                    url: route('organizations.index'),
                },
                {
                    title: "Sites",
                    url: route('sites.index'),
                },
                {
                    title: "Types",
                    url: route('plant-types.index'),
                },
                {
                    title: "Makes",
                    url: route('plant-makes.index'),
                },
                {
                    title: "Models",
                    url: route('plant-models.index'),
                },
                {
                    title: "Hazards",
                    url: route('hazards.index'),
                },
            ],
        },
    ],
    platforms: [
        {
            name: "Dashboard",
            url: route('dashboard'),
            icon: LayoutDashboard,
        },
        {
            name: "Alerts",
            url: route('alerts.index'),
            icon: ShieldAlert,
        }
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

    const { auth } = usePage<SharedData>().props;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <ScrollArea className="h-full">
                    <NavPlatforms platforms={data.platforms} />
                    <NavMain items={data.navMain} />
                </ScrollArea>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={auth.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
