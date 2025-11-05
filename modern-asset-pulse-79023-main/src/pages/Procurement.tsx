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
import { Plus, ShoppingCart, Clock, CheckCircle, TrendingUp, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface ProcurementRequest {
  id: string;
  title: string;
  requestedBy: string;
  department: string;
  status: string;
  priority: string;
  requestDate: string;
  estimatedCost: number;
  vendor: string;
  description: string;
  category: string;
  quantity: number;
  requiredBy: string;
}

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  activeContracts: number;
}

interface ProcurementStats {
  totalRequests: number;
  pendingApproval: number;
  approved: number;
  totalBudget: number;
}

export default function Procurement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stats, setStats] = useState<ProcurementStats>({
    totalRequests: 0,
    pendingApproval: 0,
    approved: 0,
    totalBudget: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcurementData();
  }, []);

  const fetchProcurementData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch procurement requests
      const requestsResponse = await fetch('http://localhost:3000/procurement/requests', { headers });
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setRequests(requestsData);
      }

      // Fetch vendors
      const vendorsResponse = await fetch('http://localhost:3000/procurement/vendors', { headers });
      if (vendorsResponse.ok) {
        const vendorsData = await vendorsResponse.json();
        setVendors(vendorsData);
      }

      // Calculate stats from requests data
      const totalRequests = requests.length;
      const pendingApproval = requests.filter(r => r.status === 'Pending Approval').length;
      const approved = requests.filter(r => r.status === 'Approved').length;
      const totalBudget = requests.reduce((sum, r) => sum + r.estimatedCost, 0);

      setStats({
        totalRequests,
        pendingApproval,
        approved,
        totalBudget,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch procurement data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/procurement/requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Purchase request approved successfully",
        });
        fetchProcurementData(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to approve request",
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
      case "Urgent":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "Low":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const statsCards = [
    {
      title: "Total Requests",
      value: stats.totalRequests.toString(),
      icon: ShoppingCart,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending Approval",
      value: stats.pendingApproval.toString(),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Approved",
      value: stats.approved.toString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Budget",
      value: `₹${(stats.totalBudget / 100000).toFixed(1)}L`,
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading procurement data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Procurement & Acquisition</h1>
          <p className="text-muted-foreground mt-1">
            Manage purchase requests and vendor information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchProcurementData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="gradient-primary" onClick={() => navigate("/procurement/add")}>
            <Plus className="mr-2 h-4 w-4" />
            New Purchase Request
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                  {requests.map((request) => (
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
                      <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">
                        ₹{request.estimatedCost.toLocaleString()}
                      </TableCell>
                      <TableCell>{request.vendor || 'Not assigned'}</TableCell>
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
                              onClick={() => handleApproveRequest(request.id)}
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
              {vendors.slice(0, 4).map((vendor) => (
                <div
                  key={vendor.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{vendor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {vendor.activeContracts} active contracts
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/vendors/${vendor.id}`)}
                  >
                    View Details
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/vendors')}
              >
                View All Vendors
              </Button>
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
                { stage: "Request Initiated", count: requests.filter(r => r.status === 'Pending Approval').length, color: "bg-warning" },
                { stage: "Manager Approval", count: requests.filter(r => r.status === 'Approved').length, color: "bg-primary" },
                { stage: "Finance Approval", count: Math.floor(requests.filter(r => r.status === 'Approved').length * 0.8), color: "bg-accent" },
                { stage: "Vendor Selection", count: requests.filter(r => r.status === 'In Procurement').length, color: "bg-success" },
                { stage: "GRN Pending", count: Math.floor(requests.filter(r => r.status === 'In Procurement').length * 0.5), color: "bg-destructive" },
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
