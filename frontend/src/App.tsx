import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthGuard } from "./features/auth/components/AuthGuard";
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LoadingSpinner } from "./components/feedback/LoadingSpinner";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("./features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./features/auth/pages/ForgotPasswordPage"));
const DashboardPage = lazy(() => import("./features/dashboard/pages/DashboardPage"));
const JobDescriptionPage = lazy(() => import("./features/job-description/pages/JobDescriptionPage"));
const SkillDNAProfilePage = lazy(() => import("./features/skill-dna-profile/pages/SkillDNAProfilePage"));
const AssessmentDashboardPage = lazy(() => import("./features/assessment/pages/AssessmentDashboardPage"));
const AssessmentPage = lazy(() => import("./features/assessment/pages/AssessmentPage"));
const ReportPage = lazy(() => import("./features/reports/pages/ReportPage"));
const LearningPage = lazy(() => import("./features/learning/pages/LearningPage"));
const CyberTwinPage = lazy(() => import("./features/cyber-twin/pages/CyberTwinPage"));
const SettingsPage = lazy(() => import("./features/settings/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("./pages/UnauthorizedPage"));

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/job-description" element={<JobDescriptionPage />} />
            <Route path="/skill-dna-profile" element={<SkillDNAProfilePage />} />
            <Route path="/assessment" element={<AssessmentDashboardPage />} />
            <Route path="/assessment/:id" element={<AssessmentPage />} />
            <Route path="/report/:id" element={<ReportPage />} />
            <Route path="/learning" element={<LearningPage />} />
            <Route path="/cyber-twin" element={<CyberTwinPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
