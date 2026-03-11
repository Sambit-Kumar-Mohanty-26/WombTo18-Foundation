import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Search, Plus, Mail, Phone, MoreHorizontal, Download } from "lucide-react";

const donors = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", total: "5,00,000", tier: "Platinum", lastDonation: "Mar 5, 2026", status: "Active", initials: "PS" },
  { id: 2, name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+91 87654 32109", total: "3,00,000", tier: "Gold", lastDonation: "Feb 28, 2026", status: "Active", initials: "RK" },
  { id: 3, name: "Anita Desai", email: "anita@email.com", phone: "+91 76543 21098", total: "2,50,000", tier: "Gold", lastDonation: "Feb 15, 2026", status: "Active", initials: "AD" },
  { id: 4, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 65432 10987", total: "1,50,000", tier: "Silver", lastDonation: "Jan 20, 2026", status: "Active", initials: "VS" },
  { id: 5, name: "Meera Patel", email: "meera@email.com", phone: "+91 54321 09876", total: "1,00,000", tier: "Silver", lastDonation: "Jan 10, 2026", status: "Active", initials: "MP" },
  { id: 6, name: "Suresh Nair", email: "suresh@email.com", phone: "+91 43210 98765", total: "75,000", tier: "Bronze", lastDonation: "Dec 5, 2025", status: "Inactive", initials: "SN" },
  { id: 7, name: "Kavita Joshi", email: "kavita@email.com", phone: "+91 32109 87654", total: "50,000", tier: "Bronze", lastDonation: "Nov 18, 2025", status: "Active", initials: "KJ" },
  { id: 8, name: "Patel Foundation", email: "csr@patelfdn.org", phone: "+91 22 4567 8900", total: "10,00,000", tier: "Platinum", lastDonation: "Mar 1, 2026", status: "Active", initials: "PF" },
];

const tierColors: Record<string, string> = {
  Platinum: "bg-gray-100 text-gray-800",
  Gold: "bg-amber-50 text-amber-800",
  Silver: "bg-gray-50 text-gray-700",
  Bronze: "bg-orange-50 text-orange-800",
};

export function AdminDonors() {
  const [search, setSearch] = useState("");
  const filtered = donors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 700 }}>Manage Donors</h1>
          <p className="text-muted-foreground">{donors.length} registered donors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" /> Add Donor
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search donors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Donor</th>
                  <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Contact</th>
                  <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Total</th>
                  <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Tier</th>
                  <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Last Donation</th>
                  <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Status</th>
                  <th className="text-left py-3 px-4 text-muted-foreground" style={{ fontWeight: 500 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{d.initials}</AvatarFallback>
                        </Avatar>
                        <span style={{ fontWeight: 500 }}>{d.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{d.email}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{d.phone}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4" style={{ fontWeight: 600 }}>₹{d.total}</td>
                    <td className="py-3 px-4">
                      <Badge className={tierColors[d.tier]}>{d.tier}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{d.lastDonation}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className={d.status === "Active" ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
