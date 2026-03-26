import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Search, Plus, Mail, Phone, MoreHorizontal, Download } from "lucide-react";

const donors = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", phone: "+91 98765 43210", total: "5,00,000", lastDonation: "Mar 5, 2026", status: "Active", initials: "PS" },
  { id: 2, name: "Rajesh Kumar", email: "rajesh@email.com", phone: "+91 87654 32109", total: "3,00,000", lastDonation: "Feb 28, 2026", status: "Active", initials: "RK" },
  { id: 3, name: "Anita Desai", email: "anita@email.com", phone: "+91 76543 21098", total: "2,50,000", lastDonation: "Feb 15, 2026", status: "Active", initials: "AD" },
  { id: 4, name: "Vikram Singh", email: "vikram@email.com", phone: "+91 65432 10987", total: "1,50,000", lastDonation: "Jan 20, 2026", status: "Active", initials: "VS" },
  { id: 5, name: "Meera Patel", email: "meera@email.com", phone: "+91 54321 09876", total: "1,00,000", lastDonation: "Jan 10, 2026", status: "Active", initials: "MP" },
  { id: 6, name: "Suresh Nair", email: "suresh@email.com", phone: "+91 43210 98765", total: "75,000", lastDonation: "Dec 5, 2025", status: "Inactive", initials: "SN" },
  { id: 7, name: "Kavita Joshi", email: "kavita@email.com", phone: "+91 32109 87654", total: "50,000", lastDonation: "Nov 18, 2025", status: "Active", initials: "KJ" },
  { id: 8, name: "Patel Foundation", email: "csr@patelfdn.org", phone: "+91 22 4567 8900", total: "10,00,000", lastDonation: "Mar 1, 2026", status: "Active", initials: "PF" },
];

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
          <h1 className="text-2xl text-gray-900 font-bold">Manage Donors</h1>
          <p className="text-gray-600">{donors.length} registered donors</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="shadow-none border-border">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button size="sm" className="font-bold shadow-sm cursor-pointer">
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
          className="pl-9 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#1D6E3F] rounded-md"
        />
      </div>

      {/* Table Card */}
      <Card className="bg-white border border-gray-200 shadow-sm rounded-lg overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-100 text-gray-700">
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Donor</th>
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Contact</th>
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Total</th>
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Last Donation</th>
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Status</th>
                  <th className="text-left py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 ring-1 ring-gray-200">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{d.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-gray-900 font-bold">{d.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5">
                        <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 font-medium"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{d.email}</p>
                        <p className="text-[13px] text-muted-foreground flex items-center gap-1.5 font-medium"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{d.phone}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900 font-extrabold">₹{d.total}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 font-medium">{d.lastDonation}</span>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="secondary" className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter ${d.status === "Active" ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                        {d.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 hover:text-gray-900">
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


