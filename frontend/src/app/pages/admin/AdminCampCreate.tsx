import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tent, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { client } from "../../lib/api/client";

export function AdminCampCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    date: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post<any>('/camps/create', form);
      // Redirect to detail page to see live QR codes
      navigate(`/admin/camps/${res?.id}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create camp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/camps')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl text-gray-900 font-bold">Create Camp</h1>
          <p className="text-gray-600">Schedule a new volunteer camp event</p>
        </div>
      </div>

      <Card className="bg-white border-gray-200 shadow-sm rounded-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Tent className="h-5 w-5 text-emerald-600" />
            Camp Details
          </CardTitle>
          <CardDescription>Enter the primary details for the event location and time.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Camp Name</Label>
              <Input 
                id="name" 
                required 
                placeholder="e.g. Malad Health Camp" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Scheduled Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  required 
                  value={form.date} 
                  onChange={e => setForm({...form, date: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location / Hub</Label>
                <Input 
                  id="location" 
                  required 
                  placeholder="e.g. Mumbai Hub" 
                  value={form.location} 
                  onChange={e => setForm({...form, location: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Internal Description</Label>
              <textarea 
                id="description"
                required
                className="w-full min-h-[100px] flex rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Details for volunteers regarding this camp..."
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Camp"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
