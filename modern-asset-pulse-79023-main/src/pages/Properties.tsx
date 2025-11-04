import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, MapPin, Plus, TrendingUp, Users } from "lucide-react";

const properties = [
  {
    id: "PROP-001",
    name: "Corporate Office - Mumbai",
    type: "Office Building",
    ownership: "Owned",
    location: "Andheri East, Mumbai",
    area: "15,000 sq.ft",
    purchaseDate: "2018-03-15",
    purchaseValue: "₹12,50,00,000",
    currentValue: "₹15,75,00,000",
    occupancy: "95%",
    status: "Occupied",
  },
  {
    id: "PROP-002",
    name: "Warehouse - Pune",
    type: "Warehouse",
    ownership: "Leased",
    location: "Hinjewadi, Pune",
    area: "25,000 sq.ft",
    leaseStart: "2022-01-01",
    leaseEnd: "2027-12-31",
    monthlyRent: "₹4,50,000",
    occupancy: "100%",
    status: "Occupied",
  },
  {
    id: "PROP-003",
    name: "Regional Office - Bangalore",
    type: "Office Space",
    ownership: "Owned",
    location: "Whitefield, Bangalore",
    area: "8,500 sq.ft",
    purchaseDate: "2020-06-10",
    purchaseValue: "₹6,80,00,000",
    currentValue: "₹8,50,00,000",
    occupancy: "88%",
    status: "Occupied",
  },
];

export default function Properties() {
  const navigate = useNavigate();
  
  const stats = [
    {
      title: "Total Properties",
      value: "24",
      icon: Building2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Owned Properties",
      value: "16",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Leased Properties",
      value: "8",
      icon: MapPin,
      color: "text-accent",
      bgColor: "bg-accent/20",
    },
    {
      title: "Total Valuation",
      value: "₹285Cr",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Occupied":
        return "bg-success/10 text-success border-success/20";
      case "Vacant":
        return "bg-warning/10 text-warning border-warning/20";
      case "Under Construction":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property & Land Assets</h1>
          <p className="text-muted-foreground mt-1">
            Manage real estate properties and land assets
          </p>
        </div>
        <Button className="gradient-primary" onClick={() => navigate("/properties/add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Property
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
          <TabsTrigger value="all">All Properties</TabsTrigger>
          <TabsTrigger value="owned">Owned</TabsTrigger>
          <TabsTrigger value="leased">Leased</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Property Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Ownership</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Area</TableHead>
                        <TableHead>Occupancy</TableHead>
                        <TableHead>Current Value</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">{property.id}</TableCell>
                          <TableCell className="font-medium">{property.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{property.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                property.ownership === "Owned"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-accent/20 text-accent-foreground border-accent"
                              }
                            >
                              {property.ownership}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{property.location}</span>
                            </div>
                          </TableCell>
                          <TableCell>{property.area}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span>{property.occupancy}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {property.currentValue || property.monthlyRent}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={getStatusColor(property.status)}
                            >
                              {property.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/properties/${property.id}`)}
                              >
                                View
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => navigate(`/properties/${property.id}`)}
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="owned">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Owned Properties</h3>
                <p className="text-sm text-muted-foreground">
                  Showing only owned properties
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leased">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12">
                <MapPin className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Leased Properties</h3>
                <p className="text-sm text-muted-foreground">
                  Showing only leased properties
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Property Valuation Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Valuation chart visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Properties by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { city: "Mumbai", count: 8, value: "₹125Cr" },
                { city: "Bangalore", count: 6, value: "₹85Cr" },
                { city: "Delhi", count: 5, value: "₹45Cr" },
                { city: "Pune", count: 3, value: "₹20Cr" },
                { city: "Chennai", count: 2, value: "₹10Cr" },
              ].map((loc) => (
                <div
                  key={loc.city}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{loc.city}</p>
                      <p className="text-sm text-muted-foreground">{loc.count} properties</p>
                    </div>
                  </div>
                  <p className="font-semibold">{loc.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
