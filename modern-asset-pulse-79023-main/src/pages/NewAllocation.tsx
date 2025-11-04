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
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { assets, employees, cities } from "@/lib/mockData";

export default function NewAllocation() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allocationType, setAllocationType] = useState<"permanent" | "temporary">("permanent");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Asset allocated successfully!");
      navigate("/allocation");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/allocation")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Asset Allocation</h1>
          <p className="text-muted-foreground mt-1">Assign an asset to an employee or department</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset">Select Asset *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose asset to allocate" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets
                      .filter((a) => a.status === "Active" && !a.assignedTo.includes("Team"))
                      .map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.name} ({asset.id}) - {asset.location}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium">Asset Information</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span> Laptop
                  </div>
                  <div>
                    <span className="text-muted-foreground">Serial No:</span> DL5520-2023-001
                  </div>
                  <div>
                    <span className="text-muted-foreground">Value:</span> ₹65,000
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span> Available
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Allocation Type</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Allocation Duration *</Label>
                <Select
                  value={allocationType}
                  onValueChange={(v) => setAllocationType(v as "permanent" | "temporary")}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="permanent">Permanent Allocation</SelectItem>
                    <SelectItem value="temporary">Temporary Allocation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {allocationType === "temporary" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input id="startDate" type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedReturn">Expected Return Date *</Label>
                    <Input id="expectedReturn" type="date" required />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Assignee Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignTo">Assign To *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee or team" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="team-engineering">Engineering Team</SelectItem>
                    <SelectItem value="team-design">Design Team</SelectItem>
                    <SelectItem value="team-it">IT Department</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee} value={employee.toLowerCase()}>
                        {employee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select required>
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
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select required>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose of Allocation *</Label>
                <Textarea
                  id="purpose"
                  placeholder="Describe the purpose or project for which the asset is being allocated..."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Terms & Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span className="text-sm">
                    The assignee acknowledges responsibility for the asset and will report any damage or
                    loss immediately.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span className="text-sm">
                    The asset will be used solely for official purposes and returned in good condition.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span className="text-sm">
                    Regular maintenance and proper care of the asset is the assignee's responsibility.
                  </span>
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions or requirements..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Allocating..." : "Allocate Asset"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate("/allocation")}>
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
