import { NavLink, useNavigate } from "react-router-dom";
import { useUserRole } from "@/context/RoleContext";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Wrench,
  Laptop,
  Building2,
  TrendingDown,
  Trash2,
  FileText,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navigation = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ["admin", "asset_manager", "procurement_officer", "maintenance_manager", "it_asset_manager", "department_head", "auditor", "finance", "disposal_officer", "employee", "viewer"] },
  { title: "Asset Register", url: "/assets", icon: Package, roles: ["admin", "asset_manager", "department_head", "auditor", "employee", "viewer"] },
  { title: "Procurement", url: "/procurement", icon: ShoppingCart, roles: ["admin", "procurement_officer", "asset_manager", "finance"] },
  { title: "Commissioning", url: "/commissioning", icon: Wrench, roles: ["admin", "asset_manager", "maintenance_manager"] },
  { title: "Allocation", url: "/allocation", icon: Users, roles: ["admin", "asset_manager", "department_head"] },
  { title: "Maintenance", url: "/maintenance", icon: Wrench, roles: ["admin", "maintenance_manager", "asset_manager"] },
  { title: "IT Assets", url: "/it-assets", icon: Laptop, roles: ["admin", "it_asset_manager", "asset_manager"] },
  { title: "Properties", url: "/properties", icon: Building2, roles: ["admin", "asset_manager", "department_head", "auditor", "viewer"] },
  { title: "Depreciation", url: "/depreciation", icon: TrendingDown, roles: ["admin", "finance", "asset_manager"] },
  { title: "Disposal", url: "/disposal", icon: Trash2, roles: ["admin", "disposal_officer", "asset_manager", "finance"] },
  { title: "Requests", url: "/requests", icon: FileText, roles: ["admin", "asset_manager", "employee", "viewer"] },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const userRole = useUserRole();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Package className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-sidebar-foreground">AssetFlow</h2>
            <p className="text-xs text-sidebar-foreground/70">Asset Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation
                .filter((item) => item.roles.includes(userRole))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2 transition-smooth ${
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/notifications"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 transition-smooth hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground/70 transition-smooth hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-semibold text-primary-foreground">RA</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">Rajesh Agarwal</p>
            <p className="text-xs text-sidebar-foreground/70">Admin</p>
          </div>
          <Button variant="ghost" size="icon" className="text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
