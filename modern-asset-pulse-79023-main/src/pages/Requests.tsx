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
import { FileText, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

const requests = [
  {
    id: "REQ-001",
    type: "Asset Transfer",
    title: "Transfer Dell Laptop to Mumbai Office",
    requestedBy: "Priya Sharma",
    department: "Engineering",
    date: "2024-01-10",
    status: "Pending Approval",
    priority: "Medium",
  },
  {
    id: "REQ-002",
    type: "Asset Update",
    title: "Update Asset Information - MacBook Pro",
    requestedBy: "Amit Patel",
    department: "Design",
    date: "2024-01-09",
    status: "Approved",
    priority: "Low",
  },
  {
    id: "REQ-003",
    type: "NOC",
    title: "No Objection Certificate for Vehicle",
    requestedBy: "Vikram Singh",
    department: "Operations",
    date: "2024-01-08",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "REQ-004",
    type: "Asset Surrender",
    title: "Surrender iPhone 14 Pro",
    requestedBy: "Sneha Reddy",
    department: "Sales",
    date: "2024-01-07",
    status: "Completed",
    priority: "Medium",
  },
];

export default function Requests() {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Total Requests",
      value: "156",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending",
      value: "28",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Approved",
      value: "112",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Rejected",
      value: "16",
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success border-success/20";
      case "Approved":
        return "bg-success/10 text-success border-success/20";
      case "Pending Approval":
        return "bg-warning/10 text-warning border-warning/20";
      case "In Progress":
        return "bg-primary/10 text-primary border-primary/20";
      case "Rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Requests & Approvals</h1>
          <p className="text-muted-foreground mt-1">
            Manage asset-related requests and approval workflows
          </p>
        </div>
        <Button 
          className="gradient-primary"
          onClick={() => navigate("/requests/new")}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Request
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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Requested By</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{request.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{request.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium max-w-xs truncate">
                            {request.title}
                          </TableCell>
                          <TableCell>{request.requestedBy}</TableCell>
                          <TableCell>{request.department}</TableCell>
                          <TableCell>{request.date}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(request.priority)}
                            >
                              {request.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(request.status)}
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/requests/${request.id}`)}
                              >
                                View
                              </Button>
                              {request.status === "Pending Approval" && (
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    toast.success("Request approved successfully!");
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
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Pending Requests</h3>
                <p className="text-sm text-muted-foreground">
                  Showing only pending approval requests
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">My Requests</h3>
                <p className="text-sm text-muted-foreground">
                  Showing only your submitted requests
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Request Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Asset Transfer", count: 45, icon: "📦" },
                { type: "Asset Update", count: 38, icon: "✏️" },
                { type: "NOC", count: 28, icon: "📄" },
                { type: "Asset Surrender", count: 25, icon: "↩️" },
                { type: "Maintenance", count: 20, icon: "🔧" },
              ].map((item) => (
                <div
                  key={item.type}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium">{item.type}</p>
                      <p className="text-sm text-muted-foreground">{item.count} requests</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      toast.success(`Opening ${item.type} requests...`);
                    }}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Request Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                {
                  date: "2 hours ago",
                  title: "Request REQ-001 submitted",
                  desc: "Asset transfer request by Priya Sharma",
                  icon: AlertCircle,
                  color: "text-primary",
                },
                {
                  date: "5 hours ago",
                  title: "Request REQ-002 approved",
                  desc: "Asset update request approved by manager",
                  icon: CheckCircle,
                  color: "text-success",
                },
                {
                  date: "1 day ago",
                  title: "Request REQ-004 completed",
                  desc: "Asset surrender process completed",
                  icon: CheckCircle,
                  color: "text-success",
                },
              ].map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`rounded-full bg-muted p-2`}>
                      <event.icon className={`h-4 w-4 ${event.color}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.desc}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
