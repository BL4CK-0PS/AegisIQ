import { Card, Badge } from '@/components/ui';
import SkillDNAOverview from './components/SkillDNAOverview';
import AssessmentHistory from './components/AssessmentHistory';
import CareerCompass from './components/CareerCompass';
import GrowthTrajectory from './components/GrowthTrajectory';
import { Fingerprint } from 'lucide-react';

export default function CyberTwinPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Fingerprint className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cyber Twin</h1>
          <p className="text-sm text-muted-foreground">Your digital capability identity</p>
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
