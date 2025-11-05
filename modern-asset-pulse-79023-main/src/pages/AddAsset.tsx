import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Upload, Save, QrCode } from "lucide-react";
import { toast } from "sonner";
import { cities, employees } from "@/lib/mockData";

export default function AddAsset() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [assetName, setAssetName] = useState("");
  const [assetType, setAssetType] = useState("");
  const [category, setCategory] = useState("");
  const [model, setModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [description, setDescription] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseCost, setPurchaseCost] = useState("");
  const [vendor, setVendor] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [warrantyPeriod, setWarrantyPeriod] = useState("");
  const [warrantyExpiry, setWarrantyExpiry] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  // File uploads
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [warrantyFile, setWarrantyFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Upload files first if present
      let invoiceFileUrl = "";
      let warrantyFileUrl = "";
      const token = localStorage.getItem("token");
      if (invoiceFile) {
        const formData = new FormData();
        formData.append("file", invoiceFile);
        const res = await fetch("http://localhost:3000/files/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          invoiceFileUrl = data.url || data.path;
        }
      }
      if (warrantyFile) {
        const formData = new FormData();
        formData.append("file", warrantyFile);
        const res = await fetch("http://localhost:3000/files/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        if (res.ok) {
          const data = await res.json();
          warrantyFileUrl = data.url || data.path;
        }
      }
      // Prepare asset data
      const assetData = {
        name: assetName,
        type: assetType,
        category,
        model,
        serialNumber,
        description,
        purchaseDate,
        purchaseCost: Number(purchaseCost),
        vendor,
        invoiceNumber,
        warrantyPeriod: Number(warrantyPeriod),
        warrantyExpiry,
        location,
        department,
        assignedTo,
        invoiceFile: invoiceFileUrl,
        warrantyFile: warrantyFileUrl
      };
      // Create asset
      const res = await fetch("http://localhost:3000/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(assetData)
      });
      if (!res.ok) throw new Error("Failed to add asset");
      toast.success("Asset added successfully!");
      navigate("/assets");
    } catch (err) {
      toast.error("Failed to add asset. Please check your data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/assets")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Asset</h1>
          <p className="text-muted-foreground mt-1">Fill in the details to register a new asset</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="assetName">Asset Name *</Label>
                    <Input id="assetName" placeholder="Dell Latitude 5520" required value={assetName} onChange={e => setAssetName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="assetType">Asset Type *</Label>
                    <Select required value={assetType} onValueChange={setAssetType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="printer">Printer</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="furniture">Furniture</SelectItem>
                        <SelectItem value="server">Server</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="property">Property</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select required value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="it">IT Equipment</SelectItem>
                        <SelectItem value="furniture">Office Furniture</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="infrastructure">IT Infrastructure</SelectItem>
                        <SelectItem value="realestate">Real Estate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="model">Model/Make</Label>
                    <Input id="model" placeholder="Model number or make" value={model} onChange={e => setModel(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input id="serialNumber" placeholder="DL5520-2024-XXX" required value={serialNumber} onChange={e => setSerialNumber(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details about the asset..."
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseDate">Purchase Date *</Label>
                    <Input id="purchaseDate" type="date" required value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchaseCost">Purchase Cost (₹) *</Label>
                    <Input id="purchaseCost" type="number" placeholder="75000" required value={purchaseCost} onChange={e => setPurchaseCost(e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Supplier</Label>
                    <Input id="vendor" placeholder="Dell India" value={vendor} onChange={e => setVendor(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input id="invoiceNumber" placeholder="INV-2024-XXX" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="warrantyPeriod">Warranty Period (Months)</Label>
                    <Input id="warrantyPeriod" type="number" placeholder="36" value={warrantyPeriod} onChange={e => setWarrantyPeriod(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
                    <Input id="warrantyExpiry" type="date" value={warrantyExpiry} onChange={e => setWarrantyExpiry(e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Location & Assignment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Select required value={location} onValueChange={setLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city.toLowerCase()}>
                            {city} Office
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">Engineering</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="it">IT</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To</Label>
                  <Select value={assignedTo} onValueChange={setAssignedTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee (optional)" />
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
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Invoice Document</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Click to upload invoice</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={e => setInvoiceFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Warranty Document</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Click to upload warranty</p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.png" onChange={e => setWarrantyFile(e.target.files?.[0] || null)} />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 space-y-4">
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                    <QrCode className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">
                    QR code will be generated after asset is created
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Asset"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/assets")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
