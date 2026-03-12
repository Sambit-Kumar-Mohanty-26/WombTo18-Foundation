import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { User, Building2 } from "lucide-react";

interface DonationTabsProps {
  onTypeChange: (type: "individual" | "organization") => void;
  individualForm: React.ReactNode;
  organizationForm: React.ReactNode;
}

export function DonationTabs({ onTypeChange, individualForm, organizationForm }: DonationTabsProps) {
  return (
    <Tabs 
      defaultValue="individual" 
      className="w-full"
      onValueChange={(value) => onTypeChange(value as "individual" | "organization")}
    >
      <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100 p-1 h-12">
        <TabsTrigger 
          value="individual" 
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-700 font-bold gap-2"
        >
          <User className="h-4 w-4" />
          Individual
        </TabsTrigger>
        <TabsTrigger 
          value="organization" 
          className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-gray-700 font-bold gap-2"
        >
          <Building2 className="h-4 w-4" />
          Organization
        </TabsTrigger>
      </TabsList>
      <TabsContent value="individual" className="mt-0">
        {individualForm}
      </TabsContent>
      <TabsContent value="organization" className="mt-0">
        {organizationForm}
      </TabsContent>
    </Tabs>
  );
}
