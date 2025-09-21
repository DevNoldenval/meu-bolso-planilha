import { NavLink, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  Plus, 
  CreditCard, 
  Users,
  Wallet
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", to: "/", icon: LayoutDashboard },
  { name: "Lançamentos", to: "/lancamentos", icon: Plus },
  { name: "Cartões", to: "/cartoes", icon: CreditCard },
  { name: "Usuários", to: "/usuarios", icon: Users },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary border-b sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-primary-foreground" />
              <h1 className="ml-2 text-xl font-bold text-primary-foreground">
                FinanceApp
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-card border-r min-h-[calc(100vh-4rem)] sticky top-16">
          <div className="p-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-card"
                          : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                      )
                    }
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}