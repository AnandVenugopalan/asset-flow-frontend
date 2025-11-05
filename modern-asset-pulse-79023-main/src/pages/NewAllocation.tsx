import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";

interface AllocationForm {
  assetId: string;
  assignedTo: string;
  department: string;
  location: string;
  purpose: string;
  allocationType: "permanent" | "temporary";
  startDate?: string;
  expectedReturn?: string;
  notes: string;
}

interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  purchaseCost: number;
  status: string;
  location: string;
  category: string;
}

export default function NewAllocation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allocationType, setAllocationType] = useState<"permanent" | "temporary">("permanent");
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [formData, setFormData] = useState<AllocationForm>({
    assetId: '',
    assignedTo: '',
    department: '',
    location: '',
    purpose: '',
    allocationType: 'permanent',
    notes: '',
  });

  useEffect(() => {
    fetchAvailableAssets();
  }, []);

  const fetchAvailableAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/assets?status=Active&assignedTo=null', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const assets = await response.json();
        setAvailableAssets(assets);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch available assets",
        variant: "destructive",
      });
    }
  };

  const handleAssetSelect = (assetId: string) => {
    const asset = availableAssets.find(a => a.id === assetId);
    setSelectedAsset(asset || null);
    setFormData(prev => ({ ...prev, assetId }));
  };

  const handleInputChange = (field: keyof AllocationForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/allocation/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          allocationType,
          assignDate: new Date().toISOString(),
          assignedBy: 'Current User', // This should come from user context
          status: 'Active',
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Asset allocated successfully",
        });
        navigate("/allocation");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to allocate asset",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                <Select value={formData.assetId} onValueChange={handleAssetSelect} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose asset to allocate" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAssets.map((asset) => (
                      <SelectItem key={asset.id} value={asset.id}>
                        {asset.name} ({asset.id}) - {asset.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAsset && (
                <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                  <p className="text-sm font-medium">Asset Information</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Type:</span> {selectedAsset.category}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Serial No:</span> {selectedAsset.serialNumber}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Value:</span> ₹{selectedAsset.purchaseCost.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Status:</span> {selectedAsset.status}
                    </div>
                  </div>
                </div>
              )}
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
                  onValueChange={(v: "permanent" | "temporary") => setAllocationType(v)}
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
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate || ''}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedReturn">Expected Return Date *</Label>
                    <Input
                      id="expectedReturn"
                      type="date"
                      value={formData.expectedReturn || ''}
                      onChange={(e) => handleInputChange('expectedReturn', e.target.value)}
                      required
                    />
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
                <Input
                  id="assignTo"
                  placeholder="Employee name or team"
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Select value={formData.location} onValueChange={(value) => handleInputChange('location', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mumbai">Mumbai Office</SelectItem>
                      <SelectItem value="Delhi">Delhi Office</SelectItem>
                      <SelectItem value="Bangalore">Bangalore Office</SelectItem>
                      <SelectItem value="Pune">Pune Office</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad Office</SelectItem>
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
                  value={formData.purpose}
                  onChange={(e) => handleInputChange('purpose', e.target.value)}
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
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
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
