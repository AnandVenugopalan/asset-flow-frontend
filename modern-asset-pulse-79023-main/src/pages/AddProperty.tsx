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
import { ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { cities } from "@/lib/mockData";

export default function AddProperty() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ownership, setOwnership] = useState<"owned" | "leased">("owned");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Property added successfully!");
      navigate("/properties");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/properties")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Property</h1>
          <p className="text-muted-foreground mt-1">Register a new property or land asset</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyName">Property Name *</Label>
                  <Input id="propertyName" placeholder="Corporate Office - Mumbai" required />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="office">Office Building</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="retail">Retail Space</SelectItem>
                        <SelectItem value="land">Land/Plot</SelectItem>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="factory">Factory/Manufacturing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownership">Ownership Status *</Label>
                    <Select
                      required
                      value={ownership}
                      onValueChange={(v) => setOwnership(v as "owned" | "leased")}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="leased">Leased</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea id="address" placeholder="Complete address with street and area" required />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city.toLowerCase()}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input id="pincode" placeholder="400001" required />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="area">Total Area (sq.ft) *</Label>
                    <Input id="area" type="number" placeholder="15000" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupancy">Occupancy Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="vacant">Vacant</SelectItem>
                        <SelectItem value="partial">Partially Occupied</SelectItem>
                        <SelectItem value="construction">Under Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {ownership === "owned" ? (
              <Card>
                <CardHeader>
                  <CardTitle>Ownership Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="purchaseDate">Purchase Date *</Label>
                      <Input id="purchaseDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchaseValue">Purchase Value (₹) *</Label>
                      <Input id="purchaseValue" type="number" placeholder="12500000" required />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentValue">Current Market Value (₹)</Label>
                      <Input id="currentValue" type="number" placeholder="15750000" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registrationNo">Registration Number</Label>
                      <Input id="registrationNo" placeholder="REG/MUM/2018/XXX" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surveyNo">Survey/Plot Number</Label>
                    <Input id="surveyNo" placeholder="Plot No. 123, Survey No. 456" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Lease Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="leaseStart">Lease Start Date *</Label>
                      <Input id="leaseStart" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leaseEnd">Lease End Date *</Label>
                      <Input id="leaseEnd" type="date" required />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Monthly Rent (₹) *</Label>
                      <Input id="monthlyRent" type="number" placeholder="450000" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                      <Input id="securityDeposit" type="number" placeholder="2700000" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="landlord">Landlord/Owner Name</Label>
                    <Input id="landlord" placeholder="Property Owner Name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="renewalTerms">Renewal Terms</Label>
                    <Textarea id="renewalTerms" placeholder="Details about lease renewal conditions" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Upload</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Property Documents</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center">
                          Upload deed, agreement, or lease document
                        </p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.png" multiple />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Property Images</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Upload property photos</p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" multiple />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="taxId">Property Tax ID</Label>
                  <Input id="taxId" placeholder="TAX-XXX-XXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Policy Number</Label>
                  <Input id="insurance" placeholder="POL-XXX-XXX" />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Saving..." : "Save Property"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/properties")}
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
