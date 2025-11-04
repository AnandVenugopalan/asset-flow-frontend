import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Laptop, Smartphone, Server, Monitor, Plus, AlertCircle } from "lucide-react";

const softwareLicenses = [
  {
    id: "LIC-001",
    software: "Microsoft Office 365",
    licenseType: "Subscription",
    totalLicenses: 250,
    usedLicenses: 242,
    expiryDate: "2024-12-31",
    status: "Active",
    cost: "₹8,50,000",
  },
  {
    id: "LIC-002",
    software: "Adobe Creative Cloud",
    licenseType: "Subscription",
    totalLicenses: 50,
    usedLicenses: 48,
    expiryDate: "2024-06-15",
    status: "Expiring Soon",
    cost: "₹4,25,000",
  },
  {
    id: "LIC-003",
    software: "AutoCAD",
    licenseType: "Perpetual",
    totalLicenses: 25,
    usedLicenses: 23,
    expiryDate: "2025-03-20",
    status: "Active",
    cost: "₹6,75,000",
  },
];

const hardwareDevices = [
  {
    id: "HW-001",
    device: "Dell OptiPlex 7090",
    type: "Desktop",
    assignedTo: "Anjali Desai",
    department: "Finance",
    ipAddress: "192.168.1.45",
    status: "Active",
  },
  {
    id: "HW-002",
    device: "HP EliteBook 840",
    type: "Laptop",
    assignedTo: "Rahul Verma",
    department: "Marketing",
    ipAddress: "192.168.1.78",
    status: "Active",
  },
  {
    id: "HW-003",
    device: "Lenovo ThinkPad X1",
    type: "Laptop",
    assignedTo: "Deepika Nair",
    department: "HR",
    ipAddress: "192.168.1.92",
    status: "Under Repair",
  },
];

export default function ITAssets() {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Total Devices",
      value: "542",
      icon: Laptop,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Software Licenses",
      value: "325",
      icon: Monitor,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Servers",
      value: "28",
      icon: Server,
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      title: "Mobile Devices",
      value: "156",
      icon: Smartphone,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Expiring Soon":
        return "bg-warning/10 text-warning border-warning/20";
      case "Under Repair":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IT / Digital Asset Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage software licenses, hardware devices, and digital assets
          </p>
        </div>
        <Button className="gradient-primary" onClick={() => navigate("/it-assets/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add IT Asset
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="transition-smooth hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="software" className="space-y-4">
        <TabsList>
          <TabsTrigger value="software">Software Licenses</TabsTrigger>
          <TabsTrigger value="hardware">Hardware Devices</TabsTrigger>
          <TabsTrigger value="mapping">Asset-User Mapping</TabsTrigger>
        </TabsList>

        <TabsContent value="software">
          <Card>
            <CardHeader>
              <CardTitle>Software License Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>License ID</TableHead>
                        <TableHead>Software</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Licenses</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Annual Cost</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {softwareLicenses.map((license) => (
                        <TableRow key={license.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{license.id}</TableCell>
                          <TableCell className="font-medium">{license.software}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{license.licenseType}</Badge>
                          </TableCell>
                          <TableCell>{license.totalLicenses}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="text-sm">
                                {license.usedLicenses} / {license.totalLicenses}
                              </div>
                              <div className="h-2 w-24 rounded-full bg-muted">
                                <div
                                  className="h-2 rounded-full bg-primary"
                                  style={{
                                    width: `${
                                      (license.usedLicenses / license.totalLicenses) * 100
                                    }%`,
                                  }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{license.expiryDate}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(license.status)}
                            >
                              {license.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{license.cost}</TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  toast.success(`Renewal initiated for ${license.software}`);
                                }}
                              >
                                Renew
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/it-assets/${license.id}`)}
                              >
                                Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-warning/50 bg-warning/5 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium">License Expiry Alert</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adobe Creative Cloud licenses will expire in 45 days. Consider renewing to
                      avoid service interruption.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hardware">
          <Card>
            <CardHeader>
              <CardTitle>Hardware Device Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device ID</TableHead>
                        <TableHead>Device Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hardwareDevices.map((device) => (
                        <TableRow key={device.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{device.id}</TableCell>
                          <TableCell className="font-medium">{device.device}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{device.type}</Badge>
                          </TableCell>
                          <TableCell>{device.assignedTo}</TableCell>
                          <TableCell>{device.department}</TableCell>
                          <TableCell className="font-mono text-sm">
                            {device.ipAddress}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(device.status)}
                            >
                              {device.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/it-assets/${device.id}`)}
                              >
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/it-assets/${device.id}`)}
                              >
                                Edit
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
        </TabsContent>

        <TabsContent value="mapping">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Server className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Asset-User Mapping</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md">
                  View and manage the mapping between IT assets and users. Integration with Active
                  Directory coming soon.
                </p>
                <Button 
                  onClick={() => navigate("/it-assets/mapping")}
                >
                  Configure Mapping
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
