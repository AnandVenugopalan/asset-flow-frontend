import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Edit,
  Trash2,
  QrCode,
  Download,
  MapPin,
  Calendar,
  DollarSign,
  User,
  FileText,
  History,
  Save,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  status: string;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
  currentValue: number;
  assignedTo: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  warrantyExpiry: string;
  depreciationMethod: string;
  usefulLife: number;
  createdAt: string;
  updatedAt: string;
}

interface AssetAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

export default function AssetDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [attachments, setAttachments] = useState<AssetAttachment[]>([]);
  const [attachmentsLoading, setAttachmentsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAsset();
      fetchAttachments();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/assets/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAsset(data);
        setFormData(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch asset details",
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
      setLoading(false);
    }
  };

  const fetchAttachments = async () => {
    setAttachmentsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/assets/${id}/attachments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAttachments(data);
      }
    } catch (error) {
      // Silently fail for attachments - not critical
    } finally {
      setAttachmentsLoading(false);
    }
  };

  const handleDownloadAttachment = async (attachmentId: string, filename: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/files/${attachmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        toast({
          title: "Error",
          description: "Failed to download file",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/assets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedAsset = await response.json();
        setAsset(updatedAsset);
        setEditing(false);
        toast({
          title: "Success",
          description: "Asset updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update asset",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/assets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast({
          title: "Success",
          description: "Asset deleted successfully",
        });
        navigate('/assets');
      } else {
        toast({
          title: "Error",
          description: "Failed to delete asset",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error occurred",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!asset) {
    return <div className="p-8">Asset not found</div>;
  }

  const maintenanceHistory = [
    { date: "2024-01-15", type: "Preventive", description: "Regular maintenance check", technician: "John Doe", cost: 500 },
    { date: "2023-12-01", type: "Repair", description: "Fixed electrical issue", technician: "Jane Smith", cost: 1200 },
  ];

  const transferHistory = [
    { date: "2024-01-10", from: "IT Department", to: "Finance Department", status: "Approved", approvedBy: "Manager" },
    { date: "2023-11-15", from: "Warehouse", to: "IT Department", status: "Approved", approvedBy: "Manager" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/assets')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{asset.name}</h1>
          <p className="text-muted-foreground">Asset ID: {asset.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditing(!editing)}>
            <Edit className="mr-2 h-4 w-4" />
            {editing ? 'Cancel' : 'Edit'}
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category || ''} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                            <SelectItem value="Furniture">Furniture</SelectItem>
                            <SelectItem value="Vehicles">Vehicles</SelectItem>
                            <SelectItem value="Machinery">Machinery</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="serialNumber">Serial Number</Label>
                        <Input
                          id="serialNumber"
                          value={formData.serialNumber || ''}
                          onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="model">Model</Label>
                        <Input
                          id="model"
                          value={formData.model || ''}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="manufacturer">Manufacturer</Label>
                        <Input
                          id="manufacturer"
                          value={formData.manufacturer || ''}
                          onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="assignedTo">Assigned To</Label>
                        <Input
                          id="assignedTo"
                          value={formData.assignedTo || ''}
                          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={formData.status || ''} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
                            <SelectItem value="Disposed">Disposed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={formData.description || ''}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdate}>
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setEditing(false)}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                        <p className="text-lg">{asset.name}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                        <p className="text-lg">{asset.category}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Serial Number</Label>
                        <p className="text-lg">{asset.serialNumber}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                        <p className="text-lg">{asset.model}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Manufacturer</Label>
                        <p className="text-lg">{asset.manufacturer}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                        <p className="text-lg">{asset.location}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                        <p className="text-lg">{asset.assignedTo}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <Badge variant={asset.status === 'Active' ? 'default' : 'secondary'}>{asset.status}</Badge>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                        <p className="text-lg">{asset.description}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maintenanceHistory.map((record, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="rounded-full bg-accent/20 p-2">
                        <History className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{record.type} Maintenance</p>
                          <Badge variant="outline">{record.date}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>Technician: {record.technician}</span>
                          <span>•</span>
                          <span>Cost: ₹{record.cost}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Schedule Maintenance
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transfers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transfer History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transferHistory.map((record, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="rounded-full bg-accent/20 p-2">
                        <MapPin className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">Asset Transfer</p>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          <span className="text-muted-foreground">From:</span> {record.from}
                          <span className="mx-2">→</span>
                          <span className="text-muted-foreground">To:</span> {record.to}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{record.date}</span>
                          <span>•</span>
                          <span>Approved by {record.approvedBy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    Request Transfer
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {attachmentsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : attachments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No documents attached to this asset</p>
                    </div>
                  ) : (
                    attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth"
                      >
                        <div className="flex items-center gap-3">
                          <div className="rounded-lg bg-primary/10 p-2">
                            <FileText className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{attachment.originalName}</p>
                            <p className="text-xs text-muted-foreground">
                              {attachment.mimeType.split('/')[1]?.toUpperCase()} • {(attachment.size / 1024).toFixed(1)} KB • {new Date(attachment.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadAttachment(attachment.id, attachment.originalName)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-muted-foreground" />
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download QR Code
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Request Transfer
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Schedule Maintenance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Update Information
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:bg-destructive/10">
                Initiate Disposal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Depreciation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Original Value</p>
                  <p className="text-lg font-semibold">₹{asset.purchaseCost}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-lg font-semibold text-success">₹{asset.currentValue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Depreciation</p>
                  <p className="text-lg font-semibold text-destructive">
                    ₹{asset.purchaseCost - asset.currentValue} ({((asset.purchaseCost - asset.currentValue) / asset.purchaseCost * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
