'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  History,
  LayoutDashboard,
  Lightbulb,
  ImageIcon,
  Settings,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { useAuthContext } from '@/context/auth-context';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/practice', icon: Lightbulb, label: 'Practice' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/visual-aid', icon: ImageIcon, label: 'Visual Aid' },
];

const settingsItem = { href: '/settings', icon: Settings, label: 'Settings' };

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { isAdmin } = useAuthContext();

  const visibleNavItems = navItems.filter(item => {
    if (item.href === '/practice') {
      return isAdmin;
    }
    return true;
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo />
          <div className="grow" />
          {isMobile && <SidebarTrigger />}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {visibleNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Button
                variant={pathname === item.href ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Link>
              </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant={pathname === settingsItem.href ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              asChild
            >
              <Link href={settingsItem.href}>
                <settingsItem.icon className="mr-2 h-4 w-4" />
                {settingsItem.label}
              </Link>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
