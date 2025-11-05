import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";
// import { assets } from "@/lib/mockData";

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

export default function Assets() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAssets = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);
      // Add pagination params if needed
      const token = localStorage.getItem("token");
      const res = await fetch(`/assets?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch assets");
      const data = await res.json();
      setAssets(data.items || data); // Adjust if API returns { items: [...] }
    } catch (err) {
      setError((err as Error).message || "Error fetching assets");
    } finally {
      setLoading(false);
    }
  };

  // Fetch assets on mount and when filters/search change
  React.useEffect(() => {
    fetchAssets();
    // eslint-disable-next-line
  }, [searchQuery, statusFilter, typeFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Under Maintenance":
        return "bg-warning/10 text-warning border-warning/20";
      case "Retired":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Asset Register</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all organizational assets
          </p>
        </div>
        <Button className="gradient-primary" onClick={() => navigate("/assets/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Asset
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>All Assets ({assets.length})</CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Laptop">Laptop</SelectItem>
                  <SelectItem value="Printer">Printer</SelectItem>
                  <SelectItem value="Vehicle">Vehicle</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Server">Server</SelectItem>
                  <SelectItem value="Property">Property</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline"
                onClick={() => {
                  toast.success("Exporting assets list...");
                }}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        Asset ID
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">Loading assets...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center text-destructive">{error}</TableCell>
                    </TableRow>
                  ) : assets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center">No assets found.</TableCell>
                    </TableRow>
                  ) : assets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{asset.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{asset.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {asset.serialNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{asset.category}</TableCell>
                      <TableCell>{asset.assignedTo}</TableCell>
                      <TableCell>{asset.location}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{asset.purchaseDate}</TableCell>
                      <TableCell className="font-medium">{asset.currentValue}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/assets/${asset.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => navigate(`/assets/${asset.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={async () => {
                              if (confirm(`Are you sure you want to delete ${asset.name}?`)) {
                                try {
                                  const token = localStorage.getItem("token");
                                  const res = await fetch(`/assets/${asset.id}`, {
                                    method: "DELETE",
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  if (!res.ok) throw new Error("Delete failed");
                                  toast.success("Asset deleted successfully");
                                  fetchAssets();
                                } catch {
                                  toast.error("Failed to delete asset");
                                }
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
