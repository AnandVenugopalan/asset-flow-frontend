import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "./components/layout/AppLayout";
import { RoleContext, UserRole } from "@/context/RoleContext";
import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Assets from "./pages/Assets";
import Procurement from "./pages/Procurement";
import Maintenance from "./pages/Maintenance";
import ITAssets from "./pages/ITAssets";
import Properties from "./pages/Properties";
import Depreciation from "./pages/Depreciation";
import Disposal from "./pages/Disposal";
import Requests from "./pages/Requests";
import Allocation from "./pages/Allocation";
import Login from "./pages/Login";
import AddAsset from "./pages/AddAsset";
import AssetDetail from "./pages/AssetDetail";
import AddITAsset from "./pages/AddITAsset";
import AddProperty from "./pages/AddProperty";
import NewDisposalRequest from "./pages/NewDisposalRequest";
import NewAllocation from "./pages/NewAllocation";
import TransferAsset from "./pages/TransferAsset";
import AddProcurement from "./pages/AddProcurement";
import NotFound from "./pages/NotFound";
import Commissioning from "./pages/Commissioning";

const queryClient = new QueryClient();

const roleOptions: UserRole[] = [
  "admin",
  "asset_manager",
  "procurement_officer",
  "maintenance_manager",
  "it_asset_manager",
  "department_head",
  "auditor",
  "finance",
  "disposal_officer",
  "employee",
  "viewer",
];

const App = () => {
  const [role, setRole] = useState<UserRole>("admin");
  return (
    <RoleContext.Provider value={role}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {/* Demo role selector - remove in production */}
            <div className="fixed top-2 right-2 z-50 bg-white border rounded px-3 py-2 shadow">
              <label htmlFor="role-select" className="mr-2 text-sm">Role:</label>
              <select
                id="role-select"
                value={role}
                onChange={e => setRole(e.target.value as UserRole)}
                className="border rounded px-2 py-1 text-sm"
              >
                {roleOptions.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<AppLayout><Dashboard /></AppLayout>} />
                <Route path="/assets" element={<AppLayout><Assets /></AppLayout>} />
                <Route path="/assets/add" element={<AppLayout><AddAsset /></AppLayout>} />
                <Route path="/assets/:id" element={<AppLayout><AssetDetail /></AppLayout>} />
                <Route path="/procurement" element={<AppLayout><Procurement /></AppLayout>} />
                <Route path="/procurement/add" element={<AppLayout><AddProcurement /></AppLayout>} />
                <Route path="/maintenance" element={<AppLayout><Maintenance /></AppLayout>} />
                <Route path="/allocation" element={<AppLayout><Allocation /></AppLayout>} />
                <Route path="/allocation/new" element={<AppLayout><NewAllocation /></AppLayout>} />
                <Route path="/allocation/transfer" element={<AppLayout><TransferAsset /></AppLayout>} />
                <Route path="/it-assets" element={<AppLayout><ITAssets /></AppLayout>} />
                <Route path="/it-assets/add" element={<AppLayout><AddITAsset /></AppLayout>} />
                <Route path="/properties" element={<AppLayout><Properties /></AppLayout>} />
                <Route path="/properties/add" element={<AppLayout><AddProperty /></AppLayout>} />
                <Route path="/depreciation" element={<AppLayout><Depreciation /></AppLayout>} />
                <Route path="/disposal" element={<AppLayout><Disposal /></AppLayout>} />
                <Route path="/disposal/new" element={<AppLayout><NewDisposalRequest /></AppLayout>} />
                <Route path="/requests" element={<AppLayout><Requests /></AppLayout>} />
                <Route path="/notifications" element={<AppLayout><div className="flex h-96 items-center justify-center"><p className="text-xl text-muted-foreground">Notifications Module - Coming Soon</p></div></AppLayout>} />
                <Route path="/settings" element={<AppLayout><div className="flex h-96 items-center justify-center"><p className="text-xl text-muted-foreground">Settings Module - Coming Soon</p></div></AppLayout>} />
                <Route path="/commissioning" element={<AppLayout><Commissioning /></AppLayout>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </RoleContext.Provider>
  );
};

export default App;
