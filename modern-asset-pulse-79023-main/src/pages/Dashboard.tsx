import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Wrench, Archive, DollarSign, Users, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  totalAssets: number;
  activeAssets: number;
  underMaintenance: number;
  retiredAssets: number;
  totalValue: number;
  depreciationThisMonth: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface DepreciationData {
  month: string;
  value: number;
}

interface LocationData {
  location: string;
  count: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  time: string;
  read: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalAssets: 0,
    activeAssets: 0,
    underMaintenance: 0,
    retiredAssets: 0,
    totalValue: 0,
    depreciationThisMonth: 0,
  });
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [depreciationData, setDepreciationData] = useState<DepreciationData[]>([]);
  const [locationData, setLocationData] = useState<LocationData[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:3000/reports/dashboard', { headers });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch category distribution
      const categoryResponse = await fetch('http://localhost:3000/reports/assets-by-category', { headers });
      if (categoryResponse.ok) {
        const categoryRawData = await categoryResponse.json();
        // Transform data to include colors
        const colors = [
          "hsl(var(--primary))",
          "hsl(var(--secondary))",
          "hsl(var(--accent))",
          "hsl(var(--success))",
          "hsl(var(--muted-foreground))"
        ];
        const categoryDataWithColors = categoryRawData.map((item: { category: string; count: number }, index: number) => ({
          ...item,
          color: colors[index % colors.length]
        }));
        setCategoryData(categoryDataWithColors);
      }

      // Fetch depreciation trend
      const depreciationResponse = await fetch('http://localhost:3000/reports/depreciation-trend', { headers });
      if (depreciationResponse.ok) {
        const depreciationRawData = await depreciationResponse.json();
        setDepreciationData(depreciationRawData);
      }

      // Fetch location data
      const locationResponse = await fetch('http://localhost:3000/reports/assets-by-location', { headers });
      if (locationResponse.ok) {
        const locationRawData = await locationResponse.json();
        setLocationData(locationRawData);
      }

      // Fetch recent notifications
      const notificationsResponse = await fetch('http://localhost:3000/notifications?limit=4', { headers });
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData);
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Assets",
      value: stats.totalAssets.toLocaleString(),
      change: "+12%", // This could come from API
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Active Assets",
      value: stats.activeAssets.toLocaleString(),
      change: "+8%", // This could come from API
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Under Maintenance",
      value: stats.underMaintenance.toString(),
      change: "-5%", // This could come from API
      icon: Wrench,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Retired Assets",
      value: stats.retiredAssets.toString(),
      change: "+2", // This could come from API
      icon: Archive,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Loading dashboard data...</p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your asset overview.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Reports",
                description: "Opening comprehensive reports...",
              });
            }}
          >
            <DollarSign className="mr-2 h-4 w-4" />
            View Reports
          </Button>
          <Button
            className="gradient-primary"
            onClick={() => navigate("/assets/add")}
          >
            <Package className="mr-2 h-4 w-4" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
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
              <p className="text-xs text-muted-foreground mt-1">
                <span className={stat.change.startsWith("+") ? "text-success" : "text-destructive"}>
                  {stat.change}
                </span>{" "}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Asset Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Depreciation Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Depreciation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={depreciationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assets by Location */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Assets by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={locationData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="location" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <Badge variant="secondary">{notifications.filter(n => !n.read).length} New</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.slice(0, 4).map((notification) => (
              <div
                key={notification.id}
                className={`flex gap-3 rounded-lg border p-3 transition-smooth ${
                  !notification.read ? "border-primary/50 bg-primary/5" : "border-border"
                }`}
              >
                <div className="flex-shrink-0">
                  {notification.type === "warning" && (
                    <AlertTriangle className="h-5 w-5 text-warning" />
                  )}
                  {notification.type === "info" && (
                    <Users className="h-5 w-5 text-primary" />
                  )}
                  {notification.type === "success" && (
                    <Package className="h-5 w-5 text-success" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/notifications")}
            >
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="gradient-accent">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <p className="text-sm text-muted-foreground mt-1">Manage your assets efficiently</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                toast({
                  title: "Audit",
                  description: "Starting asset audit...",
                });
              }}
            >
              Start Audit
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate("/requests/new")}
            >
              Raise Request
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Report",
                  description: "Generating comprehensive report...",
                });
              }}
            >
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
