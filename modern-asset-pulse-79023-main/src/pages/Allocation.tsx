import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Plus, ArrowRightLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const allocations = [
  {
    id: "ALLOC-001",
    asset: "Dell Latitude 5520",
    assetId: "AST-001",
    assignedTo: "Priya Sharma",
    assignedBy: "Rajesh Agarwal",
    department: "Engineering",
    assignDate: "2023-01-15",
    expectedReturn: "—",
    status: "Active",
  },
  {
    id: "ALLOC-002",
    asset: "MacBook Pro 16",
    assetId: "AST-005",
    assignedTo: "Amit Patel",
    assignedBy: "Rajesh Agarwal",
    department: "Design",
    assignDate: "2023-03-12",
    expectedReturn: "—",
    status: "Active",
  },
  {
    id: "ALLOC-003",
    asset: "Canon EOS R5",
    assetId: "AST-012",
    assignedTo: "Photography Team",
    assignedBy: "Meera Iyer",
    department: "Marketing",
    assignDate: "2024-01-08",
    expectedReturn: "2024-01-15",
    status: "Temporary",
  },
];

export default function Allocation() {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Total Allocations",
      value: "1,185",
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active",
      value: "1,142",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Temporary",
      value: "43",
      icon: ArrowRightLeft,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

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
                          <div className="font-medium">{allocation.asset}</div>
                          <div className="text-xs text-muted-foreground">
                            {allocation.assetId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{allocation.assignedTo}</TableCell>
                      <TableCell>{allocation.assignedBy}</TableCell>
                      <TableCell>{allocation.department}</TableCell>
                      <TableCell>{allocation.assignDate}</TableCell>
                      <TableCell>{allocation.expectedReturn}</TableCell>
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
                          <Button 
                            size="sm"
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
              <div className="rounded-lg border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Camera Equipment</p>
                    <p className="text-sm text-muted-foreground">Canon EOS R5 + Lenses</p>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    Checked Out
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      toast.success("Asset checked in successfully!");
                    }}
                  >
                    Check In
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => navigate("/allocation/ALLOC-003")}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transfer Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  asset: "Dell Latitude 5520",
                  from: "Mumbai Office",
                  to: "Pune Office",
                  date: "2024-01-08",
                  status: "Pending",
                },
                {
                  asset: "HP LaserJet Pro",
                  from: "Delhi Office",
                  to: "Bangalore Office",
                  date: "2024-01-05",
                  status: "Completed",
                },
              ].map((transfer, index) => (
                <div key={index} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{transfer.asset}</p>
                    <Badge
                      variant="outline"
                      className={
                        transfer.status === "Completed"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-warning/10 text-warning border-warning/20"
                      }
                    >
                      {transfer.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{transfer.from}</span>
                    <ArrowRightLeft className="h-4 w-4" />
                    <span>{transfer.to}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{transfer.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
