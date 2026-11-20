import { MotionConfig, motion } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { BookingProvider } from "@/components/booking/BookingProvider";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";

const Portfolio = lazy(() => import("@/pages/Portfolio"));
const About = lazy(() => import("@/pages/About"));
const Services = lazy(() => import("@/pages/Services"));
const Booking = lazy(() => import("@/pages/Booking"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function PageFallback() {
  return <div className="min-h-[70vh]" aria-busy="true" />;
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname, location.hash]);

  return (
    <motion.main key={location.pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, ease: "easeOut" }}>
      <Suspense fallback={<PageFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/achievements" element={<Navigate to="/about" replace />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </motion.main>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BookingProvider>
        <AppLayout>
          <AnimatedRoutes />
        </AppLayout>
      </BookingProvider>
    </MotionConfig>
  );
}
