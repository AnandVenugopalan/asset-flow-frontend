import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, ArrowRightLeft, CheckCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useEffect } from "react";

interface Allocation {
  id: string;
  assetId: string;
  assetName: string;
  assignedTo: string;
  assignedBy: string;
  department: string;
  assignDate: string;
  expectedReturn: string | null;
  status: string;
  allocationType: string;
  location: string;
  purpose: string;
}

interface AllocationStats {
  totalAllocations: number;
  active: number;
  temporary: number;
}

export default function Allocation() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [stats, setStats] = useState<AllocationStats>({
    totalAllocations: 0,
    active: 0,
    temporary: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllocations();
  }, []);

  const fetchAllocations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/allocation/assignments', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllocations(data);

        // Calculate stats
        const totalAllocations = data.length;
        const active = data.filter((a: Allocation) => a.status === 'Active').length;
        const temporary = data.filter((a: Allocation) => a.allocationType === 'temporary').length;

        setStats({
          totalAllocations,
          active,
          temporary,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch allocations",
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

  const handleCheckIn = async (allocationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/allocation/assignments/${allocationId}/checkin`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Asset checked in successfully",
        });
        fetchAllocations(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to check in asset",
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20";
      case "Temporary":
        return "bg-warning/10 text-warning border-warning/20";
      case "Returned":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const statsCards = [
    {
      title: "Total Allocations",
      value: stats.totalAllocations.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active",
      value: stats.active.toString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Temporary",
      value: stats.temporary.toString(),
      icon: ArrowRightLeft,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading allocations...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Allocation & Movement</h1>
          <p className="text-muted-foreground mt-1">
            Manage asset assignments and track asset movement
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchAllocations}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={() => navigate("/allocation/transfer")}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transfer Asset
          </Button>
          <Button className="gradient-primary" onClick={() => navigate("/allocation/new")}>
            <Plus className="mr-2 h-4 w-4" />
            New Allocation
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statsCards.map((stat) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Allocation ID</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Assigned By</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Assign Date</TableHead>
                    <TableHead>Expected Return</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocations.map((allocation) => (
                    <TableRow key={allocation.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{allocation.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{allocation.assetName}</div>
                          <div className="text-xs text-muted-foreground">
                            {allocation.assetId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{allocation.assignedTo}</TableCell>
                      <TableCell>{allocation.assignedBy}</TableCell>
                      <TableCell>{allocation.department}</TableCell>
                      <TableCell>{new Date(allocation.assignDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {allocation.expectedReturn ? new Date(allocation.expectedReturn).toLocaleDateString() : "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(allocation.status)}
                        >
                          {allocation.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/allocation/${allocation.id}`)}
                          >
                            View
                          </Button>
                          {allocation.allocationType === "temporary" && allocation.status === "Active" && (
                            <Button
                              size="sm"
                              onClick={() => handleCheckIn(allocation.id)}
                            >
                              Check In
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate("/allocation/transfer")}
                          >
                            Transfer
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Check-in / Check-out</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Manage temporary asset assignments with check-in and check-out functionality.
              </p>
              {allocations
                .filter(a => a.allocationType === "temporary" && a.status === "Active")
                .slice(0, 3)
                .map((allocation) => (
                  <div key={allocation.id} className="rounded-lg border p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{allocation.assetName}</p>
                        <p className="text-sm text-muted-foreground">Assigned to {allocation.assignedTo}</p>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        Checked Out
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleCheckIn(allocation.id)}
                      >
                        Check In
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/allocation/${allocation.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Asset Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    const response = await fetch('http://localhost:3000/allocation/check-utilization', {
                      headers: {
                        'Authorization': `Bearer ${token}`,
                      },
                    });

                    if (response.ok) {
                      const data = await response.json();
                      toast({
                        title: "Utilization Report",
                        description: `Total assets: ${data.totalAssets}, Allocated: ${data.allocatedAssets}, Available: ${data.availableAssets}`,
                      });
                    }
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Failed to fetch utilization data",
                      variant: "destructive",
                    });
                  }
                }}
              >
                Check Asset Utilization
              </Button>
              <div className="space-y-4">
                {[
                  {
                    asset: "Dell Latitude 5520",
                    utilization: 85,
                    status: "High",
                  },
                  {
                    asset: "HP LaserJet Pro",
                    utilization: 45,
                    status: "Medium",
                  },
                  {
                    asset: "MacBook Pro 16",
                    utilization: 92,
                    status: "High",
                  },
                ].map((item, index) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium">{item.asset}</p>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "High"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-warning/10 text-warning border-warning/20"
                        }
                      >
                        {item.utilization}% utilized
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          item.status === "High" ? "bg-success" : "bg-warning"
                        }`}
                        style={{ width: `${item.utilization}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
