'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  History,
  LayoutDashboard,
  Lightbulb,
  ImageIcon,
  Settings,
  UploadCloud,
  LogOut,
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { useAuthContext } from '@/context/auth-context';
import { useUser } from '@/firebase';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/practice', icon: Lightbulb, label: 'Practice' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/visual-aid', icon: ImageIcon, label: 'Visual Aid' },
  { href: '/upload', icon: UploadCloud, label: 'Upload PDF' },
];

const settingsItem = { href: '/settings', icon: Settings, label: 'Settings' };

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const { logout, isAdmin } = useAuthContext();

  const visibleNavItems = navItems.filter(item => {
    if (item.href === '/upload' || item.href === '/practice') {
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
          {user && (
             <SidebarMenuItem>
                <Button
                  variant='ghost'
                  className="w-full justify-start"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
        {user && (
          <div className="flex items-center gap-3 px-2 py-4">
            <Avatar>
              <AvatarImage src={user.photoURL ?? `https://picsum.photos/seed/${user.uid}/40/40`} />
              <AvatarFallback>{user.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm text-foreground truncate">{user.displayName ?? 'User'}</span>
              <span className="text-xs text-muted-foreground truncate">{user.email ?? 'anonymous'}</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
