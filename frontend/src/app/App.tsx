import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { router } from "./routes";
import { SmoothScrollProvider } from "./components/providers/SmoothScrollProvider";

export default function App() {
  return (
    <SmoothScrollProvider>
      <RouterProvider router={router} />
      <Analytics />
      <SpeedInsights />
      <Toaster position="top-right" richColors />
    </SmoothScrollProvider>
  );
}
