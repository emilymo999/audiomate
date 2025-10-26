import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Library as LibraryIcon, MessageSquare, Plus } from "lucide-react";
import logo from "@/assets/audiomate-logo.png";

const savedAds = [
  { title: "Summer Sale Campaign", id: "summer-sale" },
  { title: "Product Launch Audio", id: "product-launch" },
  { title: "Holiday Special Ad", id: "holiday-special" },
];

export function DashboardSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-border">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Audiomate" className="h-8 w-8" />
          <span className="text-lg font-bold bg-gradient-warm bg-clip-text text-transparent">
            Audiomate
          </span>
        </Link>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard?new=true">
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={location.pathname === "/library"}
                >
                  <Link to="/library">
                    <LibraryIcon className="h-4 w-4" />
                    <span>Library</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Generated Ads</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {savedAds.map((ad) => (
                <SidebarMenuItem key={ad.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === `/saved-ad/${ad.id}`}
                  >
                    <Link to={`/saved-ad/${ad.id}`}>
                      <span className="truncate">{ad.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              isActive={location.pathname === "/contact"}
            >
              <Link to="/contact">
                <MessageSquare className="h-4 w-4" />
                <span>Feedback</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
