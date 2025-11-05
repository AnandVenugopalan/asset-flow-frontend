import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, Plus, Wrench, Clock, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";

interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  type: string;
  status: string;
  priority: string;
  reportedBy: string;
  scheduledDate: string;
  vendor: string;
  estimatedCost: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface MaintenanceStats {
  totalMaintenance: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export default function Maintenance() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [stats, setStats] = useState<MaintenanceStats>({
    totalMaintenance: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  const fetchMaintenanceData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch maintenance schedules
      const schedulesResponse = await fetch('http://localhost:3000/maintenance/schedules', { headers });
      let schedulesData: MaintenanceRecord[] = [];
      if (schedulesResponse.ok) {
        schedulesData = await schedulesResponse.json();
      }

      // Fetch maintenance logs
      const logsResponse = await fetch('http://localhost:3000/maintenance/logs', { headers });
      let logsData: MaintenanceRecord[] = [];
      if (logsResponse.ok) {
        logsData = await logsResponse.json();
      }

      // Combine and deduplicate records
      const allRecords = [...schedulesData, ...logsData];
      const uniqueRecords = allRecords.filter((record, index, self) =>
        index === self.findIndex(r => r.id === record.id)
      );

      setRecords(uniqueRecords);

      // Calculate stats
      const totalMaintenance = uniqueRecords.length;
      const inProgress = uniqueRecords.filter(r => r.status === 'In Progress').length;
      const completed = uniqueRecords.filter(r => r.status === 'Completed').length;
      const overdue = uniqueRecords.filter(r => {
        const scheduledDate = new Date(r.scheduledDate);
        const now = new Date();
        return scheduledDate < now && r.status !== 'Completed';
      }).length;

      setStats({
        totalMaintenance,
        inProgress,
        completed,
        overdue,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch maintenance data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (recordId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3000/maintenance/logs/${recordId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Maintenance record updated successfully",
        });
        fetchMaintenanceData(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: "Failed to update maintenance record",
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
      case "Completed":
        return "bg-success/10 text-success border-success/20";
      case "In Progress":
        return "bg-warning/10 text-warning border-warning/20";
      case "Scheduled":
        return "bg-primary/10 text-primary border-primary/20";
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

  const filteredRecords = records.filter(record => {
    if (activeTab === "all") return true;
    if (activeTab === "preventive") return record.type === "Preventive";
    if (activeTab === "breakdown") return record.type === "Breakdown";
    if (activeTab === "scheduled") return record.status === "Scheduled";
    return true;
  });

  const statsCards = [
    {
      title: "Total Maintenance",
      value: stats.totalMaintenance.toString(),
      icon: Wrench,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "In Progress",
      value: stats.inProgress.toString(),
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Overdue",
      value: stats.overdue.toString(),
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading maintenance data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Maintenance Management</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage asset maintenance schedules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchMaintenanceData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Calendar View",
                description: "Opening calendar view...",
              });
            }}
          >
            <Calendar className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
          <Button
            className="gradient-primary"
            onClick={() => navigate("/maintenance/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Maintenance
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
          <CardTitle>Maintenance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All ({records.length})</TabsTrigger>
              <TabsTrigger value="preventive">Preventive ({records.filter(r => r.type === "Preventive").length})</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown ({records.filter(r => r.type === "Breakdown").length})</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled ({records.filter(r => r.status === "Scheduled").length})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Est. Cost</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.assetName}</div>
                              <div className="text-xs text-muted-foreground">
                                {record.assetId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(record.status)}
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(record.priority)}
                            >
                              {record.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.reportedBy}</TableCell>
                          <TableCell>{new Date(record.scheduledDate).toLocaleDateString()}</TableCell>
                          <TableCell>{record.vendor || 'Not assigned'}</TableCell>
                          <TableCell className="font-medium">
                            ₹{record.estimatedCost.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/maintenance/${record.id}`)}
                              >
                                View
                              </Button>
                              {record.status !== "Completed" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(record.id, "Completed")}
                                >
                                  Complete
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
            </TabsContent>
            <TabsContent value="preventive">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Est. Cost</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.assetName}</div>
                              <div className="text-xs text-muted-foreground">
                                {record.assetId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(record.status)}
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(record.priority)}
                            >
                              {record.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(record.scheduledDate).toLocaleDateString()}</TableCell>
                          <TableCell>{record.vendor || 'Not assigned'}</TableCell>
                          <TableCell className="font-medium">
                            ₹{record.estimatedCost.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/maintenance/${record.id}`)}
                              >
                                View
                              </Button>
                              {record.status !== "Completed" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(record.id, "Completed")}
                                >
                                  Complete
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
            </TabsContent>
            <TabsContent value="breakdown">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Reported By</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Est. Cost</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.assetName}</div>
                              <div className="text-xs text-muted-foreground">
                                {record.assetId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(record.status)}
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(record.priority)}
                            >
                              {record.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{record.reportedBy}</TableCell>
                          <TableCell>{record.vendor || 'Not assigned'}</TableCell>
                          <TableCell className="font-medium">
                            ₹{record.estimatedCost.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/maintenance/${record.id}`)}
                              >
                                View
                              </Button>
                              {record.status !== "Completed" && (
                                <Button
                                  size="sm"
                                  onClick={() => handleUpdateStatus(record.id, "Completed")}
                                >
                                  Complete
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
            </TabsContent>
            <TabsContent value="scheduled">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Asset</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Est. Cost</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{record.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{record.assetName}</div>
                              <div className="text-xs text-muted-foreground">
                                {record.assetId}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getPriorityColor(record.priority)}
                            >
                              {record.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(record.scheduledDate).toLocaleDateString()}</TableCell>
                          <TableCell>{record.vendor || 'Not assigned'}</TableCell>
                          <TableCell className="font-medium">
                            ₹{record.estimatedCost.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/maintenance/${record.id}`)}
                              >
                                View
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(record.id, "In Progress")}
                              >
                                Start
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
