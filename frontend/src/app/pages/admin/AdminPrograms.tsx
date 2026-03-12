import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Plus, Edit, Users, IndianRupee, MapPin, Calendar } from "lucide-react";

const programs = [
  {
    id: 1,
    name: "Prenatal & Maternal Care",
    status: "Active",
    budget: "₹2.4 Cr",
    spent: "₹1.9 Cr",
    progress: 79,
    beneficiaries: 3500,
    states: 12,
    startDate: "Jan 2020",
    lead: "Dr. Sunita Verma",
  },
  {
    id: 2,
    name: "Early Childhood Development",
    status: "Active",
    budget: "₹1.8 Cr",
    spent: "₹1.5 Cr",
    progress: 83,
    beneficiaries: 4200,
    states: 10,
    startDate: "Mar 2018",
    lead: "Rajiv Menon",
  },
  {
    id: 3,
    name: "Nutrition Programs",
    status: "Active",
    budget: "₹3.2 Cr",
    spent: "₹2.8 Cr",
    progress: 88,
    beneficiaries: 12000,
    states: 12,
    startDate: "Jun 2016",
    lead: "Kavitha Nair",
  },
  {
    id: 4,
    name: "Education Support",
    status: "Active",
    budget: "₹4.1 Cr",
    spent: "₹3.6 Cr",
    progress: 88,
    beneficiaries: 8100,
    states: 11,
    startDate: "Jan 2012",
    lead: "Sunita Krishnan",
  },
  {
    id: 5,
    name: "Youth Empowerment",
    status: "Active",
    budget: "₹1.5 Cr",
    spent: "₹1.0 Cr",
    progress: 67,
    beneficiaries: 2500,
    states: 8,
    startDate: "Jan 2024",
    lead: "Arjun Patel",
  },
  {
    id: 6,
    name: "Child Protection Network",
    status: "Pilot",
    budget: "₹0.8 Cr",
    spent: "₹0.4 Cr",
    progress: 50,
    beneficiaries: 500,
    states: 4,
    startDate: "Jul 2025",
    lead: "Priya Deshpande",
  },
];

export function AdminPrograms() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground font-bold">Manage Programs</h1>
          <p className="text-muted-foreground">{programs.length} active programs across India</p>
        </div>
        <Button size="sm" className="font-bold shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> New Program
        </Button>
      </div>

      <div className="grid gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="bg-card border-border shadow-sm hover:shadow-md transition-all duration-300 rounded-lg group">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg text-foreground font-bold group-hover:text-primary transition-colors">{program.name}</h3>
                    <Badge
                      variant="secondary"
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-tighter ${program.status === "Active" ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-muted text-muted-foreground"}`}
                    >
                      {program.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground mb-5 font-medium">
                    <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-muted-foreground" />{program.beneficiaries.toLocaleString()} beneficiaries</span>
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-muted-foreground" />{program.states} states</span>
                    <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-muted-foreground" />Since {program.startDate}</span>
                    <span className="flex items-center gap-1.5 text-foreground">Lead: <span className="font-bold text-foreground">{program.lead}</span></span>
                  </div>

                  {/* Budget Progress */}
                  <div className="max-w-2xl">
                    <div className="flex justify-between mb-2 text-xs">
                      <span className="text-muted-foreground font-medium">Progress</span>
                      <span className="text-foreground font-extrabold">Spent: {program.spent} / {program.budget} ({program.progress}%)</span>
                    </div>
                    <Progress value={program.progress} className="h-2 bg-muted shadow-inner" />
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 self-start lg:self-center">
                  <Button variant="outline" size="sm" className="border-border shadow-none">
                    <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

