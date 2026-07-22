import SkillDNAOverview from '../components/SkillDNAOverview';
import AssessmentHistory from '../components/AssessmentHistory';
import CareerCompass from '../components/CareerCompass';
import GrowthTrajectory from '../components/GrowthTrajectory';
import { Fingerprint } from 'lucide-react';

export default function CyberTwinPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary-900/30 p-2">
          <Fingerprint className="h-6 w-6 text-primary-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Cyber Twin</h1>
          <p className="text-sm text-surface-400">Your digital capability identity</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <SkillDNAOverview />
        </div>
        <CareerCompass />
        <div className="md:col-span-2">
          <AssessmentHistory />
        </div>
        <GrowthTrajectory />
      </div>
    </div>
  );
}
