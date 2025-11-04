import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, TrendingUp, Wrench, Archive, DollarSign, Users, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { notifications } from "@/lib/mockData";

const stats = [
  {
    title: "Total Assets",
    value: "1,247",
    change: "+12%",
    icon: Package,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Active Assets",
    value: "1,185",
    change: "+8%",
    icon: TrendingUp,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Under Maintenance",
    value: "42",
    change: "-5%",
    icon: Wrench,
    color: "text-warning",
    bgColor: "bg-warning/10",
  },
  {
    title: "Retired Assets",
    value: "20",
    change: "+2",
    icon: Archive,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
  },
];

const categoryData = [
  { name: "IT Equipment", value: 542, color: "hsl(var(--primary))" },
  { name: "Furniture", value: 289, color: "hsl(var(--secondary))" },
  { name: "Vehicles", value: 156, color: "hsl(var(--accent))" },
  { name: "Property", value: 89, color: "hsl(var(--success))" },
  { name: "Others", value: 171, color: "hsl(var(--muted-foreground))" },
];

const depreciationData = [
  { month: "Jan", value: 285 },
  { month: "Feb", value: 312 },
  { month: "Mar", value: 298 },
  { month: "Apr", value: 335 },
  { month: "May", value: 321 },
  { month: "Jun", value: 358 },
];

const locationData = [
  { location: "Mumbai", count: 342 },
  { location: "Delhi", count: 289 },
  { location: "Bangalore", count: 256 },
  { location: "Pune", count: 178 },
  { location: "Chennai", count: 182 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, Rajesh! Here's your asset overview.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              toast.success("Opening reports...");
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
                toast.success("Starting asset audit...");
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
                toast.success("Generating comprehensive report...");
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
