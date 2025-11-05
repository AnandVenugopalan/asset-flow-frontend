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

interface Asset {
  id: string;
  name: string;
  serialNumber: string;
  purchaseCost: number;
  status: string;
  location: string;
  category: string;
}

interface DisposalForm {
  assetId: string;
  reason: string;
  description: string;
  estimatedValue: string;
  salvageValue: string;
  disposalMethod: string;
}

export default function NewDisposalRequest() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableAssets, setAvailableAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState<DisposalForm>({
    assetId: '',
    reason: '',
    description: '',
    estimatedValue: '',
    salvageValue: '',
    disposalMethod: '',
  });

  useEffect(() => {
    fetchAvailableAssets();
  }, []);

  const fetchAvailableAssets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/assets?status=Active', {
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
    setFormData(prev => ({
      ...prev,
      assetId,
      estimatedValue: asset ? asset.purchaseCost.toString() : '',
    }));
  };

  const handleInputChange = (field: keyof DisposalForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/disposal/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetId: formData.assetId,
          reason: formData.reason,
          description: formData.description,
          estimatedValue: parseFloat(formData.estimatedValue),
          salvageValue: parseFloat(formData.salvageValue),
          disposalMethod: formData.disposalMethod,
          requestDate: new Date().toISOString(),
          requestedBy: 'Current User', // This should come from user context
          status: 'Pending Approval',
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Disposal request submitted successfully",
        });
        navigate("/disposal");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to submit disposal request",
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/disposal")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Disposal Request</h1>
          <p className="text-muted-foreground mt-1">Submit a request to dispose an asset</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Asset Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="asset">Select Asset *</Label>
              <Select value={formData.assetId} onValueChange={handleAssetSelect} required>
                <SelectTrigger>
                  <SelectValue placeholder="Choose asset" />
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
            <CardTitle>Disposal Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <Select value={formData.reason} onValueChange={(value) => handleInputChange('reason', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="End of Life">End of Life</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Obsolete">Obsolete</SelectItem>
                  <SelectItem value="High Maintenance Cost">High Maintenance Cost</SelectItem>
                  <SelectItem value="No Longer Needed">No Longer Needed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide detailed reason for disposal..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value (₹) *</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  placeholder="Current market value"
                  value={formData.estimatedValue}
                  onChange={(e) => handleInputChange('estimatedValue', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salvageValue">Expected Salvage Value (₹) *</Label>
                <Input
                  id="salvageValue"
                  type="number"
                  placeholder="Expected recovery value"
                  value={formData.salvageValue}
                  onChange={(e) => handleInputChange('salvageValue', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="disposalMethod">Preferred Disposal Method *</Label>
              <Select value={formData.disposalMethod} onValueChange={(value) => handleInputChange('disposalMethod', value)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select disposal method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sale">Sale (Auction/Private)</SelectItem>
                  <SelectItem value="Scrap">Scrap</SelectItem>
                  <SelectItem value="Donation">Donation</SelectItem>
                  <SelectItem value="Trade-in">Trade-in</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" className="gradient-primary" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/disposal")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
