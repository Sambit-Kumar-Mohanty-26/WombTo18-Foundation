import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";

const donors = [
  { name: "Priya Sharma", amount: "5,00,000", tier: "Platinum", initials: "PS" },
  { name: "Rajesh Kumar", amount: "3,00,000", tier: "Gold", initials: "RK" },
  { name: "Anita Desai", amount: "2,50,000", tier: "Gold", initials: "AD" },
  { name: "Vikram Singh", amount: "1,50,000", tier: "Silver", initials: "VS" },
  { name: "Meera Patel", amount: "1,00,000", tier: "Silver", initials: "MP" },
  { name: "Suresh Nair", amount: "75,000", tier: "Bronze", initials: "SN" },
  { name: "Kavita Joshi", amount: "50,000", tier: "Bronze", initials: "KJ" },
  { name: "Arjun Reddy", amount: "50,000", tier: "Bronze", initials: "AR" },
];

const tierColors: Record<string, string> = {
  Platinum: "bg-gradient-to-r from-gray-300 to-gray-100 text-gray-800",
  Gold: "bg-gradient-to-r from-amber-200 to-yellow-100 text-amber-800",
  Silver: "bg-gradient-to-r from-gray-200 to-gray-100 text-gray-700",
  Bronze: "bg-gradient-to-r from-orange-200 to-orange-100 text-orange-800",
};

export function DonorWall() {
  return (
    <section className="py-20 bg-background border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>Donor Wall of Fame</p>
          <h2 className="text-3xl sm:text-4xl text-white mb-4" style={{ fontWeight: 700 }}>
            Our Generous Supporters
          </h2>
          <p className="text-emerald-200/70 max-w-2xl mx-auto">
            Recognizing the incredible individuals and organizations whose generosity makes our mission possible.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {donors.map((donor) => (
            <div
              key={donor.name}
              className="flex items-center gap-3 p-4 rounded-xl border border-white/10 hover:shadow-md transition-shadow bg-emerald-950/20 text-white"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {donor.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-white" style={{ fontWeight: 600 }}>{donor.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-200/50">&#8377;{donor.amount}</span>
                  <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border-none ${tierColors[donor.tier]}`}>
                    {donor.tier === "Platinum" && <Star className="h-2.5 w-2.5 mr-0.5" />}
                    {donor.tier}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
