import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Plus, CheckCircle, Clock, XCircle } from "lucide-react";

const disposalRequests = [
  {
    id: "DSP-001",
    assetId: "AST-045",
    assetName: "HP ProBook 450",
    reason: "End of life",
    requestedBy: "Meera Iyer",
    requestDate: "2024-01-08",
    status: "Pending Approval",
    estimatedValue: "₹8,000",
    salvageValue: "₹5,000",
    disposalMethod: "Auction",
  },
  {
    id: "DSP-002",
    assetId: "AST-078",
    assetName: "Office Chair",
    reason: "Damaged",
    requestedBy: "Admin Team",
    requestDate: "2024-01-05",
    status: "Approved",
    estimatedValue: "₹3,500",
    salvageValue: "₹500",
    disposalMethod: "Scrap",
  },
  {
    id: "DSP-003",
    assetId: "AST-023",
    assetName: "Maruti Swift",
    reason: "High maintenance cost",
    requestedBy: "Vikram Singh",
    requestDate: "2023-12-28",
    status: "Completed",
    estimatedValue: "₹2,80,000",
    salvageValue: "₹2,65,000",
    disposalMethod: "Sale",
  },
];

export default function Disposal() {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Total Disposals",
      value: "68",
      icon: Trash2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Pending",
      value: "12",
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Completed",
      value: "52",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Rejected",
      value: "4",
      icon: XCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-success/10 text-success border-success/20";
      case "Pending Approval":
        return "bg-warning/10 text-warning border-warning/20";
      case "Approved":
        return "bg-primary/10 text-primary border-primary/20";
      case "Rejected":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Disposal & Retirement</h1>
          <p className="text-muted-foreground mt-1">
            Manage asset disposal requests and retirement workflow
          </p>
        </div>
        <Button className="gradient-primary" onClick={() => navigate("/disposal/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Disposal Request
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
          <CardTitle>Disposal Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Request ID</TableHead>
                    <TableHead>Asset</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Est. Value</TableHead>
                    <TableHead>Salvage Value</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disposalRequests.map((request) => (
                    <TableRow key={request.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.assetName}</div>
                          <div className="text-xs text-muted-foreground">
                            {request.assetId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>{request.requestedBy}</TableCell>
                      <TableCell>{request.requestDate}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {request.estimatedValue}
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        {request.salvageValue}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{request.disposalMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/disposal/${request.id}`)}
                          >
                            View
                          </Button>
                          {request.status === "Pending Approval" && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                toast.success("Disposal request approved successfully!");
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
            <CardTitle>Disposal Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { step: 1, title: "Request Initiated", desc: "User submits disposal request" },
                { step: 2, title: "Manager Review", desc: "Department head reviews request" },
                { step: 3, title: "Asset Inspection", desc: "Physical inspection and valuation" },
                { step: 4, title: "Finance Approval", desc: "CFO approves disposal" },
                { step: 5, title: "Disposal Execution", desc: "Asset disposed via chosen method" },
                { step: 6, title: "Record Updated", desc: "System records updated" },
              ].map((workflow, index) => (
                <div key={workflow.step} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                    {workflow.step}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{workflow.title}</h4>
                    <p className="text-sm text-muted-foreground">{workflow.desc}</p>
                  </div>
                  {index < 5 && (
                    <div className="absolute left-4 mt-8 h-8 w-0.5 bg-border" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disposal Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  method: "Sale",
                  count: 32,
                  revenue: "₹45.6L",
                  desc: "Public auction or private sale",
                },
                {
                  method: "Scrap",
                  count: 18,
                  revenue: "₹2.8L",
                  desc: "Sold as scrap material",
                },
                {
                  method: "Donation",
                  count: 8,
                  revenue: "—",
                  desc: "Donated to charitable organizations",
                },
                {
                  method: "Trade-in",
                  count: 10,
                  revenue: "₹12.4L",
                  desc: "Exchanged with vendor",
                },
              ].map((method) => (
                <div key={method.method} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{method.method}</h4>
                      <p className="text-xs text-muted-foreground">{method.desc}</p>
                    </div>
                    <Badge variant="secondary">{method.count} items</Badge>
                  </div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Total Revenue: </span>
                    <span className="font-semibold text-success">{method.revenue}</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
