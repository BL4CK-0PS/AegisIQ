import { useState } from "react";
import { User, Bell, Shield, Monitor, Save } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import { useAuthStore } from "@/store/auth-store";
import { apiClient } from "@/lib/api-client";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const currentUser = useAuthStore((s) => s.user);

  const displayName = profileName || (currentUser?.name ?? "");
  const displayEmail = currentUser?.email ?? "";

  const handleSave = async () => {
    setSaving(true);
    setProfileError(null);
    try {
      await apiClient.patch(`/users/${currentUser?.id}`, {
        display_name: profileName || undefined,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setProfileError("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSaved(false);

    if (!currentPassword || !newPassword) {
      setPasswordError("Please fill in all password fields");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      await apiClient.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch {
      setPasswordError("Failed to change password. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-100">Settings</h1>
        <p className="text-sm text-surface-400">Manage your account preferences</p>
      </div>

      {saved && (
        <Alert variant="success">Settings saved successfully.</Alert>
      )}
      {profileError && (
        <Alert variant="error">{profileError}</Alert>
      )}

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={18} /> Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Full Name"
            value={displayName}
            onChange={(e) => setProfileName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            value={displayEmail}
            disabled
          />
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={18} /> Notifications
          </CardTitle>
          <CardDescription>Configure notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Assessment completion", description: "Get notified when your assessment is scored", defaultChecked: true },
            { label: "Learning recommendations", description: "Receive new learning path suggestions", defaultChecked: true },
            { label: "Weekly progress report", description: "Summary of your weekly progress", defaultChecked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-surface-700/50 p-4">
              <div>
                <p className="text-sm font-medium text-surface-200">{item.label}</p>
                <p className="text-xs text-surface-500">{item.description}</p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  defaultChecked={item.defaultChecked}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-surface-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-surface-400 after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} /> Security
          </CardTitle>
          <CardDescription>Account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {passwordSaved && (
            <Alert variant="success">Password changed successfully.</Alert>
          )}
          {passwordError && (
            <Alert variant="error">{passwordError}</Alert>
          )}
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button variant="secondary" size="sm" onClick={handleChangePassword}>
            Change Password
          </Button>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor size={18} /> Appearance
          </CardTitle>
          <CardDescription>Customize the interface</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between rounded-lg border border-surface-700/50 p-4">
            <div>
              <p className="text-sm font-medium text-surface-200">Dark Mode</p>
              <p className="text-xs text-surface-500">Use dark theme (default)</p>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" defaultChecked className="peer sr-only" />
              <div className="peer h-6 w-11 rounded-full bg-surface-700 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-surface-400 after:transition-all peer-checked:bg-primary-600 peer-checked:after:translate-x-full peer-checked:after:bg-white" />
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} leftIcon={<Save size={16} />} isLoading={saving}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
