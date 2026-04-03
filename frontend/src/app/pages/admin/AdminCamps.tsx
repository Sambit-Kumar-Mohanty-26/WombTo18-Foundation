import { useEffect, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { Tent, Plus, MapPin, Calendar, Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { client } from "../../lib/api/client";

export function AdminCamps() {
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCamps, setTotalCamps] = useState(0);
  const navigate = useNavigate();
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);
    client.get<any>(`/camps/list?page=${page}&limit=${pageSize}`)
      .then(res => {
        const items = Array.isArray(res) ? res : res?.items || [];
        setCamps(items);
        setTotalPages(Array.isArray(res) ? Math.max(1, Math.ceil(items.length / pageSize)) : (res?.totalPages || 1));
        setTotalCamps(Array.isArray(res) ? items.length : (res?.total || 0));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  const startCount = totalCamps === 0 ? 0 : ((page - 1) * pageSize) + 1;
  const endCount = Math.min(page * pageSize, totalCamps);
  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);
    const pages = [1];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);

    if (left > 2) pages.push(-1);
    for (let p = left; p <= right; p += 1) pages.push(p);
    if (right < totalPages - 1) pages.push(-1);
    pages.push(totalPages);
    return pages;
  })();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-gray-900 font-bold">Manage Camps</h1>
          <p className="text-gray-600">
            {totalCamps} active and upcoming camps
            {totalCamps > 0 && (
              <span className="ml-2 text-gray-500">
                Showing {startCount}-{endCount} of {totalCamps}
              </span>
            )}
          </p>
        </div>
        <Button onClick={() => navigate("/admin/camps/create")} size="sm" className="font-bold shadow-sm bg-emerald-600 hover:bg-emerald-500 text-white">
          <Plus className="h-4 w-4 mr-2" /> Create Camp
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
      ) : (
        <div className="grid gap-4">
          {camps.map((camp) => (
            <Card 
              key={camp.id} 
              className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg group cursor-pointer"
              onClick={() => navigate(`/admin/camps/${camp.id}`)}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50">
                    <Tent className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{camp.name}</h3>
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mt-1">
                      <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3" /> {camp.location}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(camp.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><Users className="h-3 w-3" /> {camp._count?.participations || 0} Participants</span>
                    </div>
                  </div>
                </div>
                <Badge className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${camp.status === 'ACTIVE' ? 'bg-amber-100 text-amber-700' : camp.status === 'COMPLETED' ? 'bg-gray-100 text-gray-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {camp.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
          {camps.length === 0 && (
             <div className="text-center py-20 text-gray-400">
               <Tent className="h-12 w-12 mx-auto mb-3 text-gray-200" />
               <p className="font-bold">No camps created yet</p>
               <p className="text-sm mt-1">Click 'Create Camp' to schedule a new event.</p>
             </div>
          )}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (page > 1) setPage(current => current - 1);
                }}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {pageNumbers.map((value, index) =>
              value === -1 ? (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={value}>
                  <PaginationLink
                    href="#"
                    isActive={value === page}
                    onClick={(event) => {
                      event.preventDefault();
                      setPage(value);
                    }}
                  >
                    {value}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  if (page < totalPages) setPage(current => current + 1);
                }}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
