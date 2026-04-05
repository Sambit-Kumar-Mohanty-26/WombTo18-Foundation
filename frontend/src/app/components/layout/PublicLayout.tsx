import { Outlet } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";
import { useContentProtection } from "../../hooks/useContentProtection";
import { ScrollProgressBar } from "../ui/ScrollProgressBar";

export function PublicLayout() {
  useContentProtection();

  return (
    <div className="min-h-screen flex flex-col content-protected">
      <ScrollProgressBar />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
