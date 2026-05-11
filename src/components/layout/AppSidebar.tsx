// src/components/layout/AppSidebar.tsx
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Lightbulb, 
  CalendarClock, 
  BarChart3, 
  User,
  Target,
} from "lucide-react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSettings } from "@/contexts/SettingsContext";
import { TranslationText } from "@/i18n/translations";

const menuItems: { title: keyof TranslationText; url: string; icon: any }[] = [
  { title: "dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "tasks", url: "/tasks", icon: CheckSquare },
  { title: "goals", url: "/goals", icon: Target },
  { title: "routineLogs", url: "/routine-logs", icon: Calendar },
  { title: "recommendations", url: "/recommendations", icon: Lightbulb },
  { title: "scheduler", url: "/scheduler", icon: CalendarClock },
  { title: "analytics", url: "/analytics", icon: BarChart3 },
  { title: "profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { t } = useSettings();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="pt-2">
        <SidebarGroup className="px-2">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2 py-2 mb-1">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <RouterNavLink 
                        to={item.url} 
                        end 
                        className={`
                          flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg 
                          transition-all duration-200
                          ${isActive 
                            ? "bg-indigo-600 text-white shadow-md" 
                            : "hover:bg-muted text-foreground"
                          }
                        `}
                      >
                        <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : ""}`} />
                        {open && (
                          <span className="font-medium">{t(item.title)}</span>
                        )}
                      </RouterNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}