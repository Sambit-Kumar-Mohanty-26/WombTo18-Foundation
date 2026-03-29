import { createBrowserRouter } from "react-router";
import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { BlogPage } from "./pages/BlogPage";
import { PressPage } from "./pages/PressPage";
import { ImpactPage } from "./pages/ImpactPage";
import { ComingSoonPage } from "./pages/ComingSoonPage";
import { TransparencyPage } from "./pages/TransparencyPage";
import { GetInvolvedPage } from "./pages/GetInvolvedPage";
import { CompliancePage } from "./pages/CompliancePage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfUsePage } from "./pages/TermsOfUsePage";
import { DonatePage } from "./pages/DonatePage";
import { DonorDashboard } from "./pages/donor/DonorDashboard";
import { DonorDonations } from "./pages/donor/DonorDonations";
import { DonorReports } from "./pages/donor/DonorReports";
import { DonorCertificates } from "./pages/donor/DonorCertificates";
import { DonorEvents } from "./pages/donor/DonorEvents";
import { DonorLogin } from "./pages/donor/DonorLogin";
import { DonorVerifyOtp } from "./pages/donor/DonorVerifyOtp";
import { DonorProfile } from "./pages/donor/DonorProfile";
import { DonationSuccessPage } from "./pages/DonationSuccessPage";
import { DashboardPreviewPage } from "./pages/DashboardPreviewPage";

import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminDonors } from "./pages/admin/AdminDonors";
import { AdminPrograms } from "./pages/admin/AdminPrograms";
import { AdminReports } from "./pages/admin/AdminReports";
import { AdminBlog } from "./pages/admin/AdminBlog";
import { AdminCaseStudies } from "./pages/admin/AdminCaseStudies";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      { index: true, Component: HomePage },
      { path: "about", Component: AboutPage },
      { path: "services", Component: ServicesPage },
      { path: "blog", Component: BlogPage },
      { path: "press", Component: PressPage },
      { path: "impact", Component: ImpactPage },
      { path: "transparency", Component: TransparencyPage },
      { path: "get-involved", Component: GetInvolvedPage },
      { path: "compliance", Component: CompliancePage },
      { path: "privacy-policy", Component: PrivacyPolicyPage },
      { path: "terms-of-use", Component: TermsOfUsePage },
      { path: "coming-soon", Component: ComingSoonPage },
      { path: "donate", Component: DonatePage },
      { path: "donation-success", Component: DonationSuccessPage },
      { path: "dashboard-preview", Component: DashboardPreviewPage },
      { path: "donor/login", Component: DonorLogin },
      { path: "donor/verify-otp", Component: DonorVerifyOtp },

    ],
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DonorDashboard },
      { path: "donations", Component: DonorDonations },
      { path: "reports", Component: DonorReports },
      { path: "certificates", Component: DonorCertificates },
      { path: "events", Component: DonorEvents },
      { path: "profile", Component: DonorProfile },

    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboard },
      { path: "donors", Component: AdminDonors },
      { path: "programs", Component: AdminPrograms },
      { path: "reports", Component: AdminReports },
      { path: "blog", Component: AdminBlog },
      { path: "case-studies", Component: AdminCaseStudies },
    ],
  },
]);