import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar, Clock, MapPin, Users, Video, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const upcomingEvents = [
  {
    id: "evt-1",
    title: "Annual Donor Meet 2026",
    date: "Apr 15, 2026",
    time: "10:00 AM - 4:00 PM",
    location: "Mumbai Convention Center, Bandra",
    type: "In-person",
    description: "Join us for our annual donor meet where we share the year's impact, recognize top donors, and unveil next year's programs.",
    attendees: 120,
    status: "Open",
  },
  {
    id: "evt-2",
    title: "Virtual Impact Review - Q1 2026",
    date: "Apr 5, 2026",
    time: "3:00 PM - 4:30 PM",
    location: "Zoom (link will be shared after RSVP)",
    type: "Virtual",
    description: "A detailed walkthrough of Q1 achievements, field updates, and financial reporting for all program donors.",
    attendees: 85,
    status: "Open",
  },
  {
    id: "evt-3",
    title: "School Visit - Raigad District",
    date: "Apr 22, 2026",
    time: "9:00 AM - 2:00 PM",
    location: "Raigad, Maharashtra",
    type: "Field Visit",
    description: "Visit our education center in Raigad district. Interact with children, teachers, and community health workers.",
    attendees: 15,
    status: "Limited Spots",
  },
  {
    id: "evt-4",
    title: "Fundraising Gala Dinner",
    date: "May 10, 2026",
    time: "7:00 PM - 10:00 PM",
    location: "Taj Mahal Palace, Mumbai",
    type: "In-person",
    description: "An exclusive evening with performances, auctions, and keynote speeches by field workers and beneficiaries.",
    attendees: 200,
    status: "Open",
  },
];

const pastEvents = [
  {
    id: "evt-p1",
    title: "Year-End Impact Celebration 2025",
    date: "Dec 15, 2025",
    type: "In-person",
    attended: true,
  },
  {
    id: "evt-p2",
    title: "Virtual Impact Review - Q4 2025",
    date: "Jan 10, 2026",
    type: "Virtual",
    attended: true,
  },
  {
    id: "evt-p3",
    title: "Community Health Camp - Pune",
    date: "Nov 20, 2025",
    type: "Field Visit",
    attended: false,
  },
];

function getTypeIcon(type: string) {
  switch (type) {
    case "Virtual":
      return Video;
    case "Field Visit":
      return MapPin;
    default:
      return Calendar;
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case "Virtual":
      return "bg-blue-50 text-blue-700";
    case "Field Visit":
      return "bg-green-50 text-green-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

export function DonorEvents() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Events</h1>
        <p className="text-gray-600">Join donor meets, field visits, and virtual impact reviews.</p>
      </div>

      {/* Upcoming Events */}
      <div className="space-y-4">
        <h3 className="text-lg text-gray-900" style={{ fontWeight: 600 }}>Upcoming Events</h3>
        {upcomingEvents.map((event) => {
          const TypeIcon = getTypeIcon(event.type);
          return (
            <Card key={event.id} className="bg-white border-gray-200 hover:shadow-sm shadow-sm transition-shadow">
              <CardContent className="pt-5">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Date Badge */}
                  <div className="sm:w-20 shrink-0 text-center">
                    <div className="bg-primary/10 rounded-xl p-3 inline-block sm:block">
                      <p className="text-xs text-primary" style={{ fontWeight: 600 }}>
                        {event.date.split(" ")[0]}
                      </p>
                      <p className="text-2xl text-primary" style={{ fontWeight: 800 }}>
                        {event.date.split(" ")[1]?.replace(",", "")}
                      </p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h4 className="text-lg text-gray-900" style={{ fontWeight: 600 }}>{event.title}</h4>
                      <Badge className={`${getTypeColor(event.type)} shrink-0`}>
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {event.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" /> {event.attendees} expected
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 h-8 text-xs" onClick={() => toast.success("RSVP Successful", { description: "We have sent the event details to your email." })}>
                        RSVP Now
                      </Button>
                      {event.status === "Limited Spots" && (
                        <Badge variant="outline" className="text-red-600 border-red-200">Limited Spots</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Past Events */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Past Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-900" style={{ fontWeight: 500 }}>{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date} &middot; {event.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {event.attended ? (
                    <Badge variant="secondary" className="bg-[#f0faf4] text-[#1D6E3F] text-xs">Attended</Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-xs text-gray-600">Missed</Badge>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-gray-500 hover:text-gray-900 hover:bg-white" onClick={() => toast.info("Redirecting to external event page...")}>
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
