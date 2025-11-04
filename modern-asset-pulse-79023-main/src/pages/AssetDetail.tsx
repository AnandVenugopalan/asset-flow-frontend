import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "lucide-react";
import { assets } from "@/lib/mockData";

export default function AssetDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Find asset by ID or use first asset as demo
  const asset = assets.find(a => a.id === id) || assets[0];

  const maintenanceHistory = [
    {
      date: "2023-12-15",
      type: "Preventive",
      description: "Hardware checkup and cleaning",
      cost: "₹2,500",
      status: "Completed",
    },
    {
      date: "2023-09-10",
      type: "Repair",
      description: "Battery replacement",
      cost: "₹5,800",
      status: "Completed",
    },
  ];

  const transferHistory = [
    {
      date: "2023-06-20",
      from: "Delhi Office",
      to: "Mumbai Office",
      approvedBy: "Rajesh Agarwal",
      status: "Completed",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/assets")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{asset.name}</h1>
              <Badge
                variant="outline"
                className={
                  asset.status === "Active"
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-warning/10 text-warning border-warning/20"
                }
              >
                {asset.status}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{asset.id} • {asset.serialNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <QrCode className="mr-2 h-4 w-4" />
            View QR
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" className="text-destructive hover:bg-destructive/10">
            <Trash2 className="mr-2 h-4 w-4" />
            Retire
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Asset Type</p>
                    <p className="font-medium">{asset.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Category</p>
                    <p className="font-medium">{asset.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Serial Number</p>
                    <p className="font-mono text-sm">{asset.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Date</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{asset.purchaseDate}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned To</p>
                    <div className="flex items-center gap-2 mt-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{asset.assignedTo}</p>
                        <p className="text-xs text-muted-foreground">{asset.department}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{asset.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purchase Cost</p>
                    <div className="flex items-center gap-2 mt-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">{asset.purchaseCost}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Value</p>
                    <p className="font-medium text-success">{asset.currentValue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="maintenance">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="transfers">Transfers</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="maintenance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Maintenance History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maintenanceHistory.map((record, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="rounded-full bg-primary/10 p-2">
                        <History className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">{record.type} Maintenance</p>
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{record.date}</span>
                          <span>•</span>
                          <span className="font-medium">{record.cost}</span>
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
                  {[
                    { name: "Purchase Invoice", type: "PDF", size: "245 KB", date: "2023-01-15" },
                    { name: "Warranty Certificate", type: "PDF", size: "182 KB", date: "2023-01-15" },
                    { name: "Asset Image", type: "JPG", size: "1.2 MB", date: "2023-01-16" },
                  ].map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-smooth"
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-primary/10 p-2">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.type} • {doc.size} • {doc.date}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
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
                  <p className="text-lg font-semibold">{asset.purchaseCost}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Value</p>
                  <p className="text-lg font-semibold text-success">{asset.currentValue}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Depreciation</p>
                  <p className="text-lg font-semibold text-destructive">₹10,000 (13.3%)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
