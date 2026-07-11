import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ReportSummary from '../components/ReportSummary';
import CapabilityMatrix from '../components/CapabilityMatrix';
import EvidencePanel from '../components/EvidencePanel';
import MentorFeedback from '../components/MentorFeedback';
import Recommendations from '../components/Recommendations';

const mockReport = {
  overall_score: 78,
  confidence: 0.85,
  summary:
    'Your organization demonstrates solid foundational cybersecurity practices with particular strength in log analysis and communication protocols. However, there are notable gaps in threat detection capabilities and network security configurations that should be addressed to improve your overall security posture.',
  capability_scores: [
    { name: 'Incident Response', score: 82, max_score: 100, confidence: 0.88, category: 'Operations' },
    { name: 'Threat Detection', score: 74, max_score: 100, confidence: 0.82, category: 'Detection' },
    { name: 'Log Analysis', score: 88, max_score: 100, confidence: 0.91, category: 'Analysis' },
    { name: 'Network Security', score: 71, max_score: 100, confidence: 0.79, category: 'Infrastructure' },
    { name: 'Communication', score: 85, max_score: 100, confidence: 0.87, category: 'Operations' },
  ],
  strengths: [
    'Well-documented incident response procedures with clear escalation paths',
    'Strong log aggregation and correlation across multiple data sources',
    'Effective cross-team communication during security events',
    'Regular security awareness training for all employees',
  ],
  weaknesses: [
    'Incomplete network segmentation allowing lateral movement risks',
    'Insufficient automated threat detection for zero-day exploits',
    'Lack of redundancy in critical security monitoring systems',
    'Delayed patch management cycle for third-party applications',
  ],
  evidence: [
    {
      capability: 'Incident Response',
      description: 'Tabletop exercise conducted in Q1 showed 90% of team members understood their roles during a simulated ransomware attack.',
      quality: 'strong',
      source: 'Q1 Tabletop Exercise Report',
    },
    {
      capability: 'Threat Detection',
      description: 'SIEM rules detected only 62% of simulated attack vectors during the red team assessment.',
      quality: 'moderate',
      source: 'Red Team Assessment - March 2026',
    },
    {
      capability: 'Log Analysis',
      description: 'Centralized logging platform successfully correlated events across 12 critical systems with 99.2% uptime.',
      quality: 'strong',
      source: 'Log Infrastructure Audit',
    },
    {
      capability: 'Network Security',
      description: 'Vulnerability scan revealed 23 critical devices lacking proper network segmentation controls.',
      quality: 'weak',
      source: 'Network Vulnerability Scan - April 2026',
    },
    {
      capability: 'Communication',
      description: 'Stakeholder notification process achieved an average response time of 4.2 minutes during incident drills.',
      quality: 'strong',
      source: 'Communication Protocol Test',
    },
  ],
  recommendations: [
    {
      title: 'Implement Zero Trust Network Architecture',
      description: 'Deploy micro-segmentation across all critical network zones to limit lateral movement. Start with the DMZ and gradually extend to internal segments.',
      priority: 'high',
      category: 'Network Security',
    },
    {
      title: 'Upgrade SIEM Detection Rules',
      description: 'Update correlation rules to include behavioral analytics and anomaly detection for advanced persistent threat identification.',
      priority: 'high',
      category: 'Threat Detection',
    },
    {
      title: 'Establish Automated Patch Management',
      description: 'Implement a automated patching pipeline for third-party applications with a maximum 72-hour window for critical vulnerabilities.',
      priority: 'medium',
      category: 'Infrastructure',
    },
    {
      title: 'Deploy Deception Technology',
      description: 'Integrate honeypots and honeytokens into the network to improve early threat detection and reduce false positive rates.',
      priority: 'medium',
      category: 'Threat Detection',
    },
    {
      title: 'Conduct Quarterly Incident Response Drills',
      description: 'Schedule regular tabletop exercises and live simulations to maintain team readiness and identify process gaps.',
      priority: 'low',
      category: 'Operations',
    },
  ],
};

export default function ReportPage() {
  const { reportId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Assessment Report</h1>
              <p className="text-sm text-muted-foreground">
                Report ID: {reportId || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <ReportSummary report={mockReport} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CapabilityMatrix capabilities={mockReport.capability_scores} />
            <EvidencePanel evidence={mockReport.evidence} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MentorFeedback report={mockReport} />
            <Recommendations recommendations={mockReport.recommendations} />
          </div>
        </div>
      </div>
    </div>
  );
}
