import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ChevronDown,
  Users,
  Mail,
  Plus,
  X,
  ArrowRight,
  Zap
} from 'lucide-react';
import StepsSidebar from '@/components/onboarding/steps-sidebar';

interface TeamMember {
  id: string;
  email: string;
}

const industries = [
  { id: 'retail', name: 'Retail' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'hospitality', name: 'Hospitality' },
  { id: 'restaurant', name: 'Restaurant' },
  { id: 'healthcare', name: 'Healthcare' },
  { id: 'finance', name: 'Finance' },
  { id: 'other', name: 'Other' },
];

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [showTeamSection, setShowTeamSection] = useState(false);
  const [integrationId] = useState(() => Math.floor(10000 + Math.random() * 90000));

  const addTeamMember = () => {
    if (newMemberEmail && newMemberEmail.includes('@')) {
      setTeamMembers([
        ...teamMembers,
        { id: Date.now().toString(), email: newMemberEmail }
      ]);
      setNewMemberEmail('');
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handleCreateWorkspace = () => {
    setLocation('/onboarding/step2');
  };

  const isFormValid = companyName.length > 0 && selectedIndustry !== '' && (selectedIndustry !== 'other' || customIndustry.length > 0);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Main Content Area - 70% */}
      <div className="w-[70%]">
        {/* Developer Navigation */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          <span className="text-gray-400 mr-2">Dev:</span>
          <span className="text-blue-400 font-medium">Step 1</span>
          <button
            onClick={() => setLocation('/onboarding/step2')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
            data-testid="dev-next"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>

        {/* Header */}
        <header className="border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">VenueX</span>
              </div>
              <div className="text-sm text-gray-400">
                Integration ID: <span className="font-mono text-gray-600">#{integrationId}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-3xl mx-auto px-6 py-16">
        {/* Headline */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome to VenueX. Let's set up your workspace.
          </h1>
          <p className="text-gray-500">
            Let's build your offline measurement infrastructure.
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Your secure Integration ID is #{integrationId}. You can share this ID with your support team at any time.
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              data-testid="input-company-name"
            />
          </div>

          {/* Industry Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Industry
            </label>
            <div className="relative">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                data-testid="select-industry"
              >
                <option value="">Select an industry...</option>
                {industries.map((industry) => (
                  <option key={industry.id} value={industry.id}>
                    {industry.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Custom Industry Input */}
            {selectedIndustry === 'other' && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  placeholder="Please specify your industry..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  data-testid="input-custom-industry"
                />
              </div>
            )}
          </div>

          {/* Team Invitation */}
          <div className="border-t border-gray-100 pt-8">
            <button
              onClick={() => setShowTeamSection(!showTeamSection)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              data-testid="button-toggle-team"
            >
              <Users size={18} />
              Invite your technical team
              <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-500">
                Optional
              </span>
            </button>

            {showTeamSection && (
              <div className="mt-4 space-y-4">
                {/* Team Members List */}
                {teamMembers.length > 0 && (
                  <div className="space-y-2">
                    {teamMembers.map((member) => (
                      <div 
                        key={member.id}
                        className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium text-sm">
                            {member.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-gray-900">{member.email}</span>
                        </div>
                        <button
                          onClick={() => removeTeamMember(member.id)}
                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Email Input */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={newMemberEmail}
                      onChange={(e) => setNewMemberEmail(e.target.value)}
                      placeholder="email@company.com"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="input-team-email"
                      onKeyDown={(e) => e.key === 'Enter' && addTeamMember()}
                    />
                  </div>
                  <button
                    onClick={addTeamMember}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    data-testid="button-add-team-member"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <p className="text-xs text-gray-400">
                  We will send them the API documentation and security protocols.
                </p>
              </div>
            )}
          </div>

          {/* Create Workspace Button */}
          <div className="pt-4">
            <button
              onClick={handleCreateWorkspace}
              disabled={!isFormValid}
              className={`w-full py-4 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isFormValid
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              data-testid="button-create-workspace"
            >
              Create Workspace
            </button>
          </div>

          {/* Next Step Indicator */}
          {isFormValid && (
            <div className="text-center">
              <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                Next: Sync Locations <ArrowRight size={14} />
              </p>
            </div>
          )}
        </div>
        </main>
      </div>

      {/* Steps Sidebar - 30% */}
      <StepsSidebar currentStep={1} />
    </div>
  );
}
