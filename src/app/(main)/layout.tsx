'use client';

import { useAuth } from '@/app/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from '@/app/components/ui/sidebar';
import {
  LayoutDashboard,
  Briefcase,
  UserCircle,
  Contact,
  Bot,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { ThemeToggle } from '@/app/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import { Button } from '@/app/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Quick Stats' },
  { href: '/portfolio', icon: Briefcase, label: 'Mini Portfolio' },
  { href: '/about', icon: UserCircle, label: 'About Me' },
  { href: '/visiting-card', icon: Contact, label: 'Visiting Card' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Bot className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10 bg-primary/10 text-primary">
              <Bot className="h-6 w-6" />
            </Button>
            <div className="flex flex-col">
                <h2 className="text-lg font-semibold tracking-tight">Linkard</h2>
                <p className="text-xs text-muted-foreground">Freelancer Hub</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  onClick={() => router.push(item.href)}
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.photoURL || ''} />
                  <AvatarFallback>
                    {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                  </AvatarFallback>
                </Avatar>
                <span className="flex-grow truncate text-left text-sm">
                  {user.email}
                </span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:justify-end">
            <SidebarTrigger className="md:hidden"/>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:px-6 sm:py-0">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
