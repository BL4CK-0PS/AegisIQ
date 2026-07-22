import { Outlet } from "react-router-dom";
import { Shield } from "lucide-react";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-surface-950">
      <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-primary-900/20 via-surface-950 to-cyber-900/10 lg:flex">
        <div className="max-w-md text-center">
          <Shield className="mx-auto mb-6 h-16 w-16 text-primary-500" />
          <h1 className="mb-3 text-3xl font-bold text-surface-100">
            AegisIQ
          </h1>
          <p className="text-lg text-surface-400">
            Adaptive Cybersecurity Capability Intelligence Platform
          </p>
          <p className="mt-4 text-sm text-surface-500">
            We do not assess resumes. We assess cybersecurity capability.
          </p>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Shield className="h-8 w-8 text-primary-500" />
            <span className="text-xl font-bold text-surface-100">AegisIQ</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
