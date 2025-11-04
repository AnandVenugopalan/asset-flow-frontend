import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function Commissioning() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Commissioning completed and asset handed over to Operations!");
      navigate("/assets");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/assets")}> 
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Asset Commissioning</h1>
          <p className="text-muted-foreground mt-1">Test, validate, and approve asset before operation</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Installation Verification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Installation Location *</Label>
                  <Input id="location" placeholder="e.g., Main Plant Room" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installer">Installed By *</Label>
                  <Input id="installer" placeholder="e.g., John Doe / Vendor Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="installDate">Installation Date *</Label>
                  <Input id="installDate" type="date" required />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Performance Testing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tests">Tests Performed *</Label>
                  <Textarea id="tests" placeholder="Describe tests and results" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compliance">Compliance Checks *</Label>
                  <Textarea id="compliance" placeholder="Safety, regulatory, and standards checks" required />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Calibration & Tuning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="calibration">Calibration Details</Label>
                  <Textarea id="calibration" placeholder="Calibration, system tuning, adjustments" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Documentation & Approval</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="docs">Upload Documentation</Label>
                  <Input id="docs" type="file" multiple />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvedBy">Approved By *</Label>
                  <Input id="approvedBy" placeholder="e.g., Supervisor Name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approvalDate">Approval Date *</Label>
                  <Input id="approvalDate" type="date" required />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary & Handover</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="handoverNotes">Handover Notes</Label>
                  <Textarea id="handoverNotes" placeholder="Any additional notes for Operations team" />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Complete Commissioning"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
