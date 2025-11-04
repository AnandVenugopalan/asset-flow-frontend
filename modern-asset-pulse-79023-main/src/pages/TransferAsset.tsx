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
import { ArrowLeft, Save, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { assets, employees, cities } from "@/lib/mockData";

export default function TransferAsset() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Transfer request submitted successfully!");
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
          <h1 className="text-3xl font-bold">Transfer Asset</h1>
          <p className="text-muted-foreground mt-1">Transfer asset to a new location or employee</p>
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
                <Label htmlFor="asset">Select Asset to Transfer *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name} ({asset.id}) - Currently with {asset.assignedTo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <p className="text-sm font-medium">Current Asset Details</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span> Laptop
                  </div>
                  <div>
                    <span className="text-muted-foreground">Serial No:</span> DL5520-2023-001
                  </div>
                  <div>
                    <span className="text-muted-foreground">Current Location:</span> Mumbai Office
                  </div>
                  <div>
                    <span className="text-muted-foreground">Assigned To:</span> Priya Sharma
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Transfer Type *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="location">Location Transfer</SelectItem>
                    <SelectItem value="employee">Employee Transfer</SelectItem>
                    <SelectItem value="both">Location & Employee Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex-1 text-center">
                    <p className="text-sm text-muted-foreground mb-1">From</p>
                    <p className="font-medium">Mumbai Office</p>
                    <p className="text-sm">Priya Sharma</p>
                  </div>
                  <ArrowRight className="h-8 w-8 text-primary" />
                  <div className="flex-1 text-center">
                    <p className="text-sm text-muted-foreground mb-1">To</p>
                    <p className="font-medium text-primary">New Location/Person</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newLocation">New Location *</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="newEmployee">New Assignee *</Label>
                  <Select required>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Transfer *</Label>
                <Textarea
                  id="reason"
                  placeholder="Explain the reason for this transfer..."
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transfer Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="transferDate">Proposed Transfer Date *</Label>
                  <Input id="transferDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="handoverNotes">Handover Notes</Label>
                <Textarea
                  id="handoverNotes"
                  placeholder="Any special instructions for the handover process..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Asset Condition</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Condition *</Label>
                <Select required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="needs-repair">Needs Repair</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditionNotes">Condition Notes</Label>
                <Textarea
                  id="conditionNotes"
                  placeholder="Document any scratches, damages, or issues with the asset..."
                  rows={3}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span className="text-sm">
                    I confirm that the asset is in working condition and ready for transfer.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 rounded" required />
                  <span className="text-sm">
                    All accessories and documents related to this asset are included in the transfer.
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-primary/50 bg-primary/5 p-4">
            <p className="text-sm">
              <strong>Note:</strong> This transfer request requires approval from both the current and new
              location managers. You will receive a notification once approved.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit Transfer Request"}
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
