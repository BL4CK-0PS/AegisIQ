import { useNavigate } from "react-router-dom";
import { ShieldOff, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950">
      <div className="text-center">
        <ShieldOff className="mx-auto mb-4 h-16 w-16 text-danger-400" />
        <h1 className="mb-2 text-2xl font-bold text-surface-100">Access Denied</h1>
        <p className="mb-8 max-w-md text-surface-400">
          You don't have permission to access this page. Contact your administrator if you believe this is an error.
        </p>
        <Button onClick={() => navigate("/dashboard")} leftIcon={<Home size={16} />}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
