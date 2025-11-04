import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Laptop } from "lucide-react";
import { toast } from "sonner";
import { employees } from "@/lib/mockData";

export default function AddITAsset() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assetType, setAssetType] = useState<"hardware" | "software">("hardware");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`${assetType === "hardware" ? "Hardware" : "Software"} asset added successfully!`);
      navigate("/it-assets");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/it-assets")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add IT Asset</h1>
          <p className="text-muted-foreground mt-1">Register new hardware device or software license</p>
        </div>
      </div>

      <Tabs value={assetType} onValueChange={(v) => setAssetType(v as "hardware" | "software")}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="hardware">Hardware Device</TabsTrigger>
          <TabsTrigger value="software">Software License</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="hardware" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hardware Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="deviceName">Device Name *</Label>
                    <Input id="deviceName" placeholder="Dell OptiPlex 7090" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deviceType">Device Type *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="server">Server</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="smartphone">Smartphone</SelectItem>
                        <SelectItem value="printer">Printer</SelectItem>
                        <SelectItem value="scanner">Scanner</SelectItem>
                        <SelectItem value="router">Router/Network Device</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input id="manufacturer" placeholder="Dell" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model</Label>
                    <Input id="model" placeholder="OptiPlex 7090" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="serialNo">Serial Number *</Label>
                    <Input id="serialNo" placeholder="SN-XXX-XXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ipAddress">IP Address</Label>
                    <Input id="ipAddress" placeholder="192.168.1.100" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="assignedUser">Assigned To</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee} value={employee.toLowerCase()}>
                            {employee}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="hr">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specifications">Specifications</Label>
                  <Input id="specifications" placeholder="Intel i7, 16GB RAM, 512GB SSD" />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Hardware Device"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/it-assets")}>
                Cancel
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="software" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Software License Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="softwareName">Software Name *</Label>
                  <Input id="softwareName" placeholder="Microsoft Office 365" required />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="licenseType">License Type *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subscription">Subscription</SelectItem>
                        <SelectItem value="perpetual">Perpetual</SelectItem>
                        <SelectItem value="trial">Trial</SelectItem>
                        <SelectItem value="open-source">Open Source</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Version</Label>
                    <Input id="version" placeholder="2024" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="totalLicenses">Total Licenses *</Label>
                    <Input id="totalLicenses" type="number" placeholder="250" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="usedLicenses">Currently Used</Label>
                    <Input id="usedLicenses" type="number" placeholder="242" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date *</Label>
                    <Input id="purchaseDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input id="expiryDate" type="date" required />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Publisher</Label>
                    <Input id="vendor" placeholder="Microsoft" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualCost">Annual Cost (₹) *</Label>
                    <Input id="annualCost" type="number" placeholder="850000" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseKey">License Key</Label>
                  <Input id="licenseKey" type="password" placeholder="XXXXX-XXXXX-XXXXX" />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Software License"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/it-assets")}>
                Cancel
              </Button>
            </div>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  );
}
