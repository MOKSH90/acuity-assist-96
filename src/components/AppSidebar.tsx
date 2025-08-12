import { 
  Heart, 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Bed, 
  MessageSquareText, 
  Settings,
  Activity,
  Clock,
  TrendingUp
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    group: "Overview"
  },
  {
    title: "Add Patient",
    url: "/patients/new",
    icon: UserPlus,
    group: "Patients"
  },
  {
    title: "All Patients",
    url: "/patients",
    icon: Users,
    group: "Patients"
  },
  {
    title: "Bed Management",
    url: "/beds",
    icon: Bed,
    group: "Resources"
  },
  {
    title: "Staff Management",
    url: "/staff",
    icon: Users,
    group: "Admin",
    adminOnly: true
  },
  {
    title: "Doctor Feedback",
    url: "/feedback",
    icon: MessageSquareText,
    group: "Quality"
  },
  {
    title: "Analytics",
    url: "/model",
    icon: TrendingUp,
    group: "Admin"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    group: "System"
  }
];

const groupedItems = menuItems.reduce((acc, item) => {
  if (!acc[item.group]) acc[item.group] = [];
  acc[item.group].push(item);
  return acc;
}, {} as Record<string, typeof menuItems>);

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { hasRole } = useAuth();

  // Filter menu items based on user role
  const filteredGroupedItems = Object.entries(groupedItems).reduce((acc, [groupName, items]) => {
    const filteredItems = items.filter(item => {
      if (item.adminOnly) {
        return hasRole('admin');
      }
      return true;
    });
    if (filteredItems.length > 0) {
      acc[groupName] = filteredItems;
    }
    return acc;
  }, {} as Record<string, typeof menuItems>);

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium shadow-sm" 
      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground transition-smooth";

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-primary p-2 rounded-lg flex-shrink-0">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <h2 className="font-bold text-foreground truncate">AcuityAssist</h2>
              <p className="text-xs text-muted-foreground truncate">Triage System</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent className="px-2">
        {Object.entries(filteredGroupedItems).map(([groupName, items]) => (
          <SidebarGroup key={groupName}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2 py-2">
                {groupName}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className={getNavCls}
                        title={isCollapsed ? item.title : undefined}
                      >
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Collapse Trigger */}
      <div className="p-2 border-t border-border">
        <SidebarTrigger className="w-full" />
      </div>
    </Sidebar>
  );
}