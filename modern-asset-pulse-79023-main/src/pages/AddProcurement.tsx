import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcurementRequestForm {
  title: string;
  category: string;
  priority: string;
  quantity: number;
  department: string;
  description: string;
  justification: string;
  estimatedCost: number;
  budgetCode: string;
  preferredVendor: string;
  alternateVendor: string;
  requiredBy: string;
  requestedBy: string;
  managerApprover: string;
  additionalNotes: string;
}

export default function AddProcurement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ProcurementRequestForm>({
    title: '',
    category: '',
    priority: '',
    quantity: 1,
    department: '',
    description: '',
    justification: '',
    estimatedCost: 0,
    budgetCode: '',
    preferredVendor: '',
    alternateVendor: '',
    requiredBy: '',
    requestedBy: '',
    managerApprover: '',
    additionalNotes: '',
  });

  const handleInputChange = (field: keyof ProcurementRequestForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/procurement/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          requestDate: new Date().toISOString(),
          status: 'Pending Approval',
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Purchase request submitted successfully",
        });
        navigate("/procurement");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to submit purchase request",
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
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/procurement")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Purchase Request</h1>
          <p className="text-muted-foreground mt-1">Submit a new procurement request</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Request Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 10 Dell Laptops for Engineering Team"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IT Equipment">IT Equipment</SelectItem>
                        <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="IT Infrastructure">IT Infrastructure</SelectItem>
                        <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="10"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select value={formData.department} onValueChange={(value) => handleInputChange('department', value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description & Specifications *</Label>
                  <Textarea
                    id="description"
                    placeholder="Detailed description of the items needed, specifications, and any special requirements..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="justification">Business Justification *</Label>
                  <Textarea
                    id="justification"
                    placeholder="Explain why this purchase is necessary and how it will benefit the organization..."
                    rows={3}
                    value={formData.justification}
                    onChange={(e) => handleInputChange('justification', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Budget & Vendor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost (₹) *</Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      placeholder="750000"
                      value={formData.estimatedCost}
                      onChange={(e) => handleInputChange('estimatedCost', parseFloat(e.target.value) || 0)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetCode">Budget Code</Label>
                    <Input
                      id="budgetCode"
                      placeholder="DEPT-2024-IT-001"
                      value={formData.budgetCode}
                      onChange={(e) => handleInputChange('budgetCode', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="preferredVendor">Preferred Vendor</Label>
                    <Input
                      id="preferredVendor"
                      placeholder="Dell India"
                      value={formData.preferredVendor}
                      onChange={(e) => handleInputChange('preferredVendor', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternateVendor">Alternate Vendor</Label>
                    <Input
                      id="alternateVendor"
                      placeholder="HP India"
                      value={formData.alternateVendor}
                      onChange={(e) => handleInputChange('alternateVendor', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="requiredBy">Required By Date *</Label>
                    <Input
                      id="requiredBy"
                      type="date"
                      value={formData.requiredBy}
                      onChange={(e) => handleInputChange('requiredBy', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestedBy">Requested By *</Label>
                    <Input
                      id="requestedBy"
                      placeholder="John Doe"
                      value={formData.requestedBy}
                      onChange={(e) => handleInputChange('requestedBy', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Approval Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="managerApprover">Manager Approval Required</Label>
                  <Input
                    id="managerApprover"
                    placeholder="Manager Name"
                    value={formData.managerApprover}
                    onChange={(e) => handleInputChange('managerApprover', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any additional information or special instructions..."
                    rows={3}
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supporting Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Quotation/Proposal</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center">
                          Upload vendor quotations
                        </p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.png" multiple />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Additional Documents</Label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground text-center">
                          Upload supporting docs
                        </p>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.jpg,.png" multiple />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Request Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium">Draft</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Approval Workflow</span>
                  <span className="font-medium">Manager → Finance</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Estimated Timeline</span>
                  <span className="font-medium">2-3 weeks</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button type="submit" className="w-full gradient-primary" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/procurement")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
