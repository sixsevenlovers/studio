'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/icons"
import { Button } from "@/components/ui/button"
import type { NavItem } from "@/lib/types"
import { LayoutDashboard, Trophy, Github, LineChart, Calendar } from "lucide-react"

const navItems: NavItem[] = [
    { href: "/", title: "Your Routine", icon: LayoutDashboard },
    { href: "/progress", title: "Daily Progress", icon: LineChart },
    { href: "/yearly-progress", title: "Yearly Progress", icon: Calendar },
    { href: "/achievements", title: "Achievements", icon: Trophy },
]

export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="size-7 text-primary" />
                    <span className="text-lg font-semibold">Your Routine Friend</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                                asChild
                                isActive={pathname === item.href}
                                tooltip={{
                                    children: item.title,
                                    className: 'bg-primary text-primary-foreground'
                                }}
                            >
                                <Link href={item.href}>
                                    <item.icon />
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <a href="https://github.com/firebase/studio-seed-projects" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="w-full justify-start gap-2">
                        <Github />
                        <span>Source Code</span>
                    </Button>
                </a>
            </SidebarFooter>
        </Sidebar>
    )
}
