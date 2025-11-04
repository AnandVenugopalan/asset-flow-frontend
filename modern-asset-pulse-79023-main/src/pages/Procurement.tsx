import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, ShoppingCart, Clock, CheckCircle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { procurementRequests } from "@/lib/mockData";

export default function Procurement() {
  const navigate = useNavigate();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-success/10 text-success border-success/20";
      case "Pending Approval":
        return "bg-warning/10 text-warning border-warning/20";
      case "In Procurement":
        return "bg-primary/10 text-primary border-primary/20";
      case "Completed":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const stats = [
    {
      title: "Total Requests",
      value: "87",
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Approval",
      value: "15",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Approved",
      value: "52",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Budget",
      value: "₹45.2L",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Procurement & Acquisition</h1>
          <p className="text-muted-foreground mt-1">
            Manage purchase requests and vendor information
          </p>
        </div>
        <Button className="gradient-primary" onClick={() => navigate("/procurement/add")}>
          <Plus className="mr-2 h-4 w-4" />
          New Purchase Request
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

      <Card>
        <CardHeader>
          <CardTitle>Purchase Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Est. Cost</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {procurementRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell className="font-medium">{request.title}</TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>{request.department}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getPriorityColor(request.priority)}
                        >
                          {request.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell className="font-medium">
                        {request.estimatedCost}
                      </TableCell>
                      <TableCell>{request.vendor}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/procurement/${request.id}`)}
                          >
                            View
                          </Button>
                          {request.status === "Pending Approval" && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                toast.success("Purchase request approved successfully!");
                              }}
                            >
                              Approve
                            </Button>
                          )}
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
            <CardTitle>Vendor Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Dell India", "HP Authorized Service", "Featherlite", "Cisco Systems"].map(
                (vendor, index) => (
                  <div
                    key={vendor}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                  <div>
                    <p className="font-medium">{vendor}</p>
                    <p className="text-sm text-muted-foreground">
                      {index + 5} active contracts
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast.success(`Opening ${vendor} details...`);
                    }}
                  >
                    View Details
                  </Button>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Stages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Request Initiated", count: 15, color: "bg-warning" },
                { stage: "Manager Approval", count: 8, color: "bg-primary" },
                { stage: "Finance Approval", count: 5, color: "bg-accent" },
                { stage: "Vendor Selection", count: 12, color: "bg-success" },
                { stage: "GRN Pending", count: 6, color: "bg-destructive" },
              ].map((workflow) => (
                <div
                  key={workflow.stage}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${workflow.color}`} />
                    <p className="font-medium">{workflow.stage}</p>
                  </div>
                  <Badge variant="secondary">{workflow.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
