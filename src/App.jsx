import { MotionConfig, motion } from "framer-motion";
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "@/pages/Home";

const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Achievements = lazy(() => import("@/pages/Achievements"));
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
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <motion.main
      key={location.pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Suspense fallback={<PageFallback />}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/services" element={<Services />} />
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
      <AppLayout>
        <AnimatedRoutes />
      </AppLayout>
    </MotionConfig>
  );
}
