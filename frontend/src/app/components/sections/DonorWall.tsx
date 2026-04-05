import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const donors = [
  { name: "Priya Sharma", amount: "5,00,000", initials: "PS" },
  { name: "Rajesh Kumar", amount: "3,00,000", initials: "RK" },
  { name: "Anita Desai", amount: "2,50,000", initials: "AD" },
  { name: "Vikram Singh", amount: "1,50,000", initials: "VS" },
  { name: "Meera Patel", amount: "1,00,000", initials: "MP" },
  { name: "Suresh Nair", amount: "75,000", initials: "SN" },
  { name: "Kavita Joshi", amount: "50,000", initials: "KJ" },
  { name: "Arjun Reddy", amount: "50,000", initials: "AR" },
];


export function DonorWall() {
  const { t } = useTranslation('home');
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-primary text-sm mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{t('donorWall.badge')}</p>
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            {t('donorWall.heading')}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t('donorWall.desc')}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {donors.map((donor) => (
            <div
              key={donor.name}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white text-gray-900"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {donor.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate text-gray-900" style={{ fontWeight: 600 }}>{donor.name}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">&#8377;{donor.amount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
