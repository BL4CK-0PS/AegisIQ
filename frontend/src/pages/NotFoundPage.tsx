import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950">
      <div className="text-center">
        <p className="mb-4 text-8xl font-bold text-surface-700">404</p>
        <h1 className="mb-2 text-2xl font-bold text-surface-100">Page not found</h1>
        <p className="mb-8 text-surface-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />}>
            Go back
          </Button>
          <Button onClick={() => navigate("/dashboard")} leftIcon={<Home size={16} />}>
            Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
