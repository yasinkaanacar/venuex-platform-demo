import { useState, useReducer } from 'react';
import { useLocation } from 'wouter';
import { 
  Zap,
  Info,
  Check,
  Building2,
  MapPin,
  Target,
  Package,
  ArrowRight,
  ChevronDown,
  Users,
  Mail,
  Plus,
  X,
  Globe,
  Smartphone,
  Upload,
  Database,
  Lock,
  Server,
  Link2,
  ExternalLink,
  Copy,
  FileText,
  Shield,
  Clock,
  Settings
} from 'lucide-react';
import { SiGoogle, SiApple } from 'react-icons/si';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
} from '@mui/material';

interface Task {
  id: string;
  label: string;
  completed: boolean;
  description?: string;
}

interface Step {
  id: string;
  title: string;
  subtitle?: string;
  optional: boolean;
  icon: typeof Building2;
  tasks: Task[];
}

type StepAction = 
  | { type: 'SELECT_STEP'; stepId: string }
  | { type: 'COMPLETE_TASK'; stepId: string; taskId: string }
  | { type: 'UNCOMPLETE_TASK'; stepId: string; taskId: string }
  | { type: 'COMPLETE_STEP'; stepId: string };

interface StepState {
  currentStepId: string;
  steps: Step[];
  completedSteps: string[];
}

const initialSteps: Step[] = [
  {
    id: 'account',
    title: 'Account Setup',
    optional: false,
    icon: Building2,
    tasks: [
      { id: 'company', label: 'Company Information', completed: false },
      { id: 'team', label: 'Invite Team (optional)', completed: false },
    ]
  },
  {
    id: 'store',
    title: 'Store Management',
    subtitle: '(Locations & Reviews)',
    optional: true,
    icon: MapPin,
    tasks: [
      { id: 'address', label: 'Your Address Data', completed: false },
      { id: 'sync', label: 'Where to Sync', completed: false, description: 'Connect your platforms' },
      { id: 'review', label: 'Review & Connect', completed: false },
    ]
  },
  {
    id: 'attribution',
    title: 'Offline Attribution',
    optional: false,
    icon: Target,
    tasks: [
      { id: 'datasource', label: 'Connect Data Source', completed: false },
      { id: 'mapping', label: 'Map Your Fields', completed: false },
      { id: 'verify', label: 'Verify & Activate', completed: false },
    ]
  },
  {
    id: 'inventory',
    title: 'Local Inventory',
    optional: false,
    icon: Package,
    tasks: [
      { id: 'feed', label: 'Product Feed Setup', completed: false },
      { id: 'sync-inv', label: 'Sync Inventory Data', completed: false },
      { id: 'optimize', label: 'Optimization Score', completed: false },
    ]
  },
];

function stepReducer(state: StepState, action: StepAction): StepState {
  switch (action.type) {
    case 'SELECT_STEP':
      return { ...state, currentStepId: action.stepId };
    case 'COMPLETE_TASK':
      return {
        ...state,
        steps: state.steps.map(step => 
          step.id === action.stepId 
            ? {
                ...step,
                tasks: step.tasks.map(task =>
                  task.id === action.taskId ? { ...task, completed: true } : task
                )
              }
            : step
        )
      };
    case 'UNCOMPLETE_TASK':
      return {
        ...state,
        steps: state.steps.map(step => 
          step.id === action.stepId 
            ? {
                ...step,
                tasks: step.tasks.map(task =>
                  task.id === action.taskId ? { ...task, completed: false } : task
                )
              }
            : step
        )
      };
    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.stepId)
          ? state.completedSteps
          : [...state.completedSteps, action.stepId]
      };
    default:
      return state;
  }
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

export default function OnboardingUnifiedPage() {
  const [, setLocation] = useLocation();
  const [integrationId] = useState(() => Math.floor(10000 + Math.random() * 90000));
  const [companyName, setCompanyName] = useState('Jambi Engineering');
  
  const [state, dispatch] = useReducer(stepReducer, {
    currentStepId: 'store',
    steps: initialSteps,
    completedSteps: ['account'],
  });

  const currentStep = state.steps.find(s => s.id === state.currentStepId);
  const completedCount = state.completedSteps.length;
  const totalSteps = state.steps.length;

  const [selectedIndustry, setSelectedIndustry] = useState('retail');
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  
  const [googleConnected, setGoogleConnected] = useState(false);
  const [appleConnected, setAppleConnected] = useState(false);
  const [yandexConnected, setYandexConnected] = useState(false);
  
  const [dataSourceModalOpen, setDataSourceModalOpen] = useState(false);
  const [dataSourceType, setDataSourceType] = useState<'sftp' | 'api' | null>(null);
  const [salesDataModalOpen, setSalesDataModalOpen] = useState(false);
  
  const [salesConfig, setSalesConfig] = useState({
    dataSourceType: 'SFTP',
    fileUrlType: 'File URL',
    fileUrl: '',
    fileRegex: '',
    dateFormat: 'YYYY-MM-DD',
    contentFieldPath: '',
    schedulerFrequency: 'DAILY',
    schedulerTime: '09:00',
    timezone: 'Europe/Istanbul',
    username: '',
    password: '',
    privateKey: ''
  });
  
  const [urlSegments, setUrlSegments] = useState<string[]>([]);

  const handleSalesConfigChange = (field: string, value: string) => {
    setSalesConfig(prev => ({ ...prev, [field]: value }));
  };

  const addUrlSegment = () => {
    setUrlSegments([...urlSegments, '']);
  };

  const updateUrlSegment = (index: number, value: string) => {
    const updated = [...urlSegments];
    updated[index] = value;
    setUrlSegments(updated);
  };

  const removeUrlSegment = (index: number) => {
    setUrlSegments(urlSegments.filter((_, i) => i !== index));
  };

  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [teamMembers, setTeamMembers] = useState<{id: string; email: string}[]>([]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const handleStepClick = (stepId: string) => {
    dispatch({ type: 'SELECT_STEP', stepId });
  };

  const handleTaskComplete = (taskId: string) => {
    if (currentStep) {
      const task = currentStep.tasks.find(t => t.id === taskId);
      if (task?.completed) {
        dispatch({ type: 'UNCOMPLETE_TASK', stepId: currentStep.id, taskId });
      } else {
        dispatch({ type: 'COMPLETE_TASK', stepId: currentStep.id, taskId });
      }
    }
  };

  const handleConnectPlatform = (platform: 'google' | 'apple' | 'yandex') => {
    setTimeout(() => {
      if (platform === 'google') setGoogleConnected(true);
      if (platform === 'apple') setAppleConnected(true);
      if (platform === 'yandex') setYandexConnected(true);
    }, 500);
  };

  const isStepCompleted = (stepId: string) => state.completedSteps.includes(stepId);
  const isStepActive = (stepId: string) => state.currentStepId === stepId;

  const handleCompleteCurrentStep = () => {
    if (currentStep) {
      dispatch({ type: 'COMPLETE_STEP', stepId: currentStep.id });
      const currentIndex = state.steps.findIndex(s => s.id === currentStep.id);
      if (currentIndex < state.steps.length - 1) {
        dispatch({ type: 'SELECT_STEP', stepId: state.steps[currentIndex + 1].id });
      }
    }
  };

  const handleGoToDashboard = () => {
    setLocation('/');
  };

  const addTeamMember = () => {
    if (newMemberEmail && newMemberEmail.includes('@')) {
      setTeamMembers([...teamMembers, { id: Date.now().toString(), email: newMemberEmail }]);
      setNewMemberEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">VenueX</span>
            </div>
          </div>
          <button
            onClick={handleGoToDashboard}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
            data-testid="button-go-dashboard"
          >
            Go to Dashboard <ArrowRight size={16} />
          </button>
        </div>
        
        {/* Integration ID Bar */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-800">#{integrationId} {companyName}</span>
          <div className="flex items-center gap-2 text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
            <Info size={14} />
            <span className="text-xs">This is your integrationID. You can come back and continue at anytime.</span>
          </div>
        </div>
        
        {/* Progress Dots */}
        <div className="mt-4 flex items-center gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2.5 h-2.5 rounded-full transition-colors ${i < (completedCount / totalSteps) * 24 ? 'bg-amber-400' : 'bg-gray-200'}`}
            />
          ))}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Left Side - Step Cards (Horizontal Layout) */}
        <div className="w-[70%] p-8">
          <div className="flex gap-4">
            {state.steps.map((step) => {
              const completed = isStepCompleted(step.id);
              const active = isStepActive(step.id);
              
              return (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  className="flex-1 cursor-pointer"
                  data-testid={`step-card-${step.id}`}
                >
                  {/* Large Clickable Area (Empty Placeholder) */}
                  <div className={`h-[352px] rounded-lg border-2 ${
                    active ? 'border-blue-500 bg-white' : 'border-gray-300 bg-gray-100'
                  }`}>
                    {/* Empty placeholder as requested */}
                  </div>
                  
                  {/* Step Label with Status Dot */}
                  <div className="mt-3 flex items-start gap-2">
                    <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                      completed ? 'bg-green-500' : active ? 'bg-gray-800' : 'bg-white border-2 border-gray-300'
                    }`} />
                    <div className={`flex-1 px-3 py-2 rounded border ${
                      active ? 'border-blue-500 bg-white' : 'border-gray-300 bg-white'
                    }`}>
                      <p className={`text-sm font-medium ${active ? 'text-gray-900' : 'text-gray-600'}`}>
                        {step.title}
                      </p>
                      {step.subtitle && (
                        <p className="text-xs text-gray-500">{step.subtitle}</p>
                      )}
                      {step.optional && (
                        <p className="text-xs text-gray-400 mt-1">(optional)</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Task Panel */}
        <div className="w-[30%] border-l-2 border-blue-500 bg-white min-h-[calc(100vh-140px)] p-6 shadow-lg">
          {currentStep && (
            <div className="space-y-4">
              {/* Task List - Accordion Style */}
              {currentStep.tasks.map((task, index) => {
                const isExpanded = expandedTask === task.id;
                
                return (
                <div key={task.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                      task.completed 
                        ? 'bg-green-50' 
                        : isExpanded 
                          ? 'bg-blue-50' 
                          : 'bg-white hover:bg-gray-50'
                    }`}
                    data-testid={`accordion-${task.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-semibold ${task.completed ? 'text-green-600' : 'text-amber-500'}`}>
                        {index + 1}.
                      </span>
                      <p className={`font-medium ${task.completed ? 'text-green-600 line-through' : 'text-gray-800'}`}>
                        {task.label}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.completed && (
                        <div className="flex items-center gap-1 text-green-600 text-sm">
                          <Check size={16} />
                          <span>Done</span>
                        </div>
                      )}
                      <ChevronDown 
                        size={20} 
                        className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                      />
                    </div>
                  </button>
                  
                  {/* Accordion Content */}
                  {isExpanded && !task.completed && (
                    <div className="border-t border-gray-200 bg-white p-4">
                      {/* Account Setup - Company Info */}
                      {currentStep.id === 'account' && task.id === 'company' && (
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Company Name</label>
                            <input
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              data-testid="input-company-name"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 mb-1 block">Industry</label>
                            <select 
                              value={selectedIndustry}
                              onChange={(e) => setSelectedIndustry(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              data-testid="select-industry"
                            >
                              {industries.map(ind => (
                                <option key={ind.id} value={ind.id}>{ind.name}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => handleTaskComplete('company')}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            data-testid="button-save-company"
                          >
                            Save & Continue
                          </button>
                        </div>
                      )}

                      {/* Account Setup - Invite Team */}
                      {currentStep.id === 'account' && task.id === 'team' && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={newMemberEmail}
                              onChange={(e) => setNewMemberEmail(e.target.value)}
                              placeholder="colleague@company.com"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              data-testid="input-team-email"
                            />
                            <button
                              onClick={addTeamMember}
                              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                              data-testid="button-add-member"
                            >
                              <Plus size={18} className="text-gray-600" />
                            </button>
                          </div>
                          {teamMembers.length > 0 && (
                            <div className="space-y-1">
                              {teamMembers.map(member => (
                                <div key={member.id} className="flex items-center gap-2 text-sm text-gray-600">
                                  <Mail size={14} />
                                  <span>{member.email}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          <button
                            onClick={() => handleTaskComplete('team')}
                            className="text-sm text-gray-500 hover:text-gray-700"
                            data-testid="button-skip-team"
                          >
                            Skip or Continue →
                          </button>
                        </div>
                      )}

                  {/* Store Management - Address Data */}
                      {currentStep.id === 'store' && task.id === 'address' && (
                        <div className="space-y-3">
                          {/* Import via File */}
                          <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-white transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Import from File</p>
                                  <p className="text-xs text-gray-500">Upload CSV or XLSX file</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleTaskComplete('address')}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                                data-testid="button-import-file"
                              >
                                Upload
                              </button>
                            </div>
                          </div>

                          {/* Import from GBP - Main Connector */}
                          <div className="p-4 rounded-xl border-2 border-blue-300 hover:border-blue-400 bg-blue-50/50 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                  <SiGoogle className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    Import from Google Business Profile
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Connect & sync locations from your GBP account
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  setGoogleConnected(true);
                                  handleTaskComplete('address');
                                }}
                                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-blue-600 text-white hover:bg-blue-700"
                                data-testid="button-import-gbp"
                              >
                                Connect & Import
                              </button>
                            </div>
                          </div>

                          {/* Disclaimer */}
                          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <Info size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-amber-700">
                              GBP locations must be listed under a single group.
                            </p>
                          </div>
                        </div>
                      )}

                  {/* Store Management - Platform Sync */}
                      {currentStep.id === 'store' && task.id === 'sync' && (
                        <div className="space-y-3">
                          {/* Google Business Profile */}
                          <div className={`p-4 rounded-xl border-2 transition-all ${
                            googleConnected 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-blue-300 bg-white'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  googleConnected ? 'bg-green-100' : 'bg-blue-50'
                                }`}>
                                  <SiGoogle className={`w-5 h-5 ${googleConnected ? 'text-green-600' : 'text-blue-600'}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Google Business Profile</p>
                                  <p className="text-xs text-gray-500">
                                    {googleConnected ? 'Connected via location import' : 'Sync locations & reviews'}
                                  </p>
                                </div>
                              </div>
                              {googleConnected ? (
                                <div className="flex items-center gap-2 text-green-600">
                                  <Check size={18} />
                                  <span className="text-sm font-medium">Already Connected</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleConnectPlatform('google')}
                                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                  data-testid="button-connect-google"
                                >
                                  Connect
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Apple Business Connect */}
                          <div className={`p-4 rounded-xl border-2 transition-all ${
                            appleConnected 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  appleConnected ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                  <SiApple className={`w-5 h-5 ${appleConnected ? 'text-green-600' : 'text-gray-700'}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Apple Business Connect</p>
                                  <p className="text-xs text-gray-500">Apple Maps integration</p>
                                </div>
                              </div>
                              {appleConnected ? (
                                <div className="flex items-center gap-2 text-green-600">
                                  <Check size={18} />
                                  <span className="text-sm font-medium">Connected</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleConnectPlatform('apple')}
                                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                                  data-testid="button-connect-apple"
                                >
                                  Connect
                                </button>
                              )}
                            </div>
                          </div>
                          
                          {/* Yandex Business */}
                          <div className={`p-4 rounded-xl border-2 transition-all ${
                            yandexConnected 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-red-200 bg-white'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  yandexConnected ? 'bg-green-100' : 'bg-red-50'
                                }`}>
                                  <Globe className={`w-5 h-5 ${yandexConnected ? 'text-green-600' : 'text-red-600'}`} />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">Yandex Business</p>
                                  <p className="text-xs text-gray-500">Yandex Maps integration</p>
                                </div>
                              </div>
                              {yandexConnected ? (
                                <div className="flex items-center gap-2 text-green-600">
                                  <Check size={18} />
                                  <span className="text-sm font-medium">Connected</span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleConnectPlatform('yandex')}
                                  className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                  data-testid="button-connect-yandex"
                                >
                                  Connect
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Store Management - Review & Connect */}
                      {currentStep.id === 'store' && task.id === 'review' && (
                        <div className="space-y-4">
                          {/* Connected Platforms Summary */}
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">Connected Platforms</p>
                            <div className="space-y-2">
                              {/* Google Business Profile */}
                              <div className={`flex items-center justify-between p-3 rounded-lg ${
                                googleConnected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <SiGoogle className={`w-5 h-5 ${googleConnected ? 'text-green-600' : 'text-gray-400'}`} />
                                  <span className={`text-sm font-medium ${googleConnected ? 'text-green-700' : 'text-gray-500'}`}>
                                    Google Business Profile
                                  </span>
                                </div>
                                {googleConnected ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <Check size={16} />
                                    <span className="text-xs">Connected</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">Not connected</span>
                                )}
                              </div>

                              {/* Apple Business Connect */}
                              <div className={`flex items-center justify-between p-3 rounded-lg ${
                                appleConnected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <SiApple className={`w-5 h-5 ${appleConnected ? 'text-green-600' : 'text-gray-400'}`} />
                                  <span className={`text-sm font-medium ${appleConnected ? 'text-green-700' : 'text-gray-500'}`}>
                                    Apple Business Connect
                                  </span>
                                </div>
                                {appleConnected ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <Check size={16} />
                                    <span className="text-xs">Connected</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">Not connected</span>
                                )}
                              </div>

                              {/* Yandex Business */}
                              <div className={`flex items-center justify-between p-3 rounded-lg ${
                                yandexConnected ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                              }`}>
                                <div className="flex items-center gap-3">
                                  <Globe className={`w-5 h-5 ${yandexConnected ? 'text-green-600' : 'text-gray-400'}`} />
                                  <span className={`text-sm font-medium ${yandexConnected ? 'text-green-700' : 'text-gray-500'}`}>
                                    Yandex Business
                                  </span>
                                </div>
                                {yandexConnected ? (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <Check size={16} />
                                    <span className="text-xs">Connected</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">Not connected</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Location List Button */}
                          {googleConnected && (
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <MapPin size={16} className="text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">18 locations imported</span>
                                </div>
                                <button
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                                  data-testid="button-view-locations"
                                >
                                  View List <ExternalLink size={14} />
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Finalize Button */}
                          <button
                            onClick={() => handleTaskComplete('review')}
                            className="w-full px-4 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                            data-testid="button-review-done"
                          >
                            <Check size={18} />
                            Finalize Setup
                          </button>
                        </div>
                      )}

                      {/* Offline Attribution - Data Source */}
                      {currentStep.id === 'attribution' && task.id === 'datasource' && (
                        <div>
                          <button
                            onClick={() => setDataSourceModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            data-testid="button-connect-datasource"
                          >
                            Connect Data Source
                          </button>
                        </div>
                      )}

                      {/* Offline Attribution - Field Mapping */}
                      {currentStep.id === 'attribution' && task.id === 'mapping' && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Map your data fields to VenueX schema</p>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="text-gray-600">Transaction ID</span>
                              <span className="text-green-600">→ Mapped</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="text-gray-600">Customer Email</span>
                              <span className="text-green-600">→ Mapped</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b">
                              <span className="text-gray-600">Amount</span>
                              <span className="text-green-600">→ Mapped</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleTaskComplete('mapping')}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            data-testid="button-mapping-done"
                          >
                            Confirm Mapping
                          </button>
                        </div>
                      )}

                      {/* Offline Attribution - Verify */}
                      {currentStep.id === 'attribution' && task.id === 'verify' && (
                        <div>
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-3">
                            <p className="text-sm text-green-700">Data source connected and fields mapped successfully!</p>
                          </div>
                          <button
                            onClick={() => handleTaskComplete('verify')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            data-testid="button-activate"
                          >
                            Activate Attribution
                          </button>
                        </div>
                      )}

                      {/* Local Inventory - Product Feed */}
                      {currentStep.id === 'inventory' && task.id === 'feed' && (
                        <div>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Upload product feed or connect via API</p>
                          </div>
                          <button
                            onClick={() => handleTaskComplete('feed')}
                            className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            data-testid="button-feed-done"
                          >
                            Continue
                          </button>
                        </div>
                      )}

                      {/* Local Inventory - Sync */}
                      {currentStep.id === 'inventory' && task.id === 'sync-inv' && (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Sync your inventory data with connected platforms</p>
                          <button
                            onClick={() => handleTaskComplete('sync-inv')}
                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                            data-testid="button-sync-inv-done"
                          >
                            Start Sync
                          </button>
                        </div>
                      )}

                      {/* Local Inventory - Optimization */}
                      {currentStep.id === 'inventory' && task.id === 'optimize' && (
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-16 h-16 rounded-full border-4 border-amber-400 flex items-center justify-center">
                              <span className="text-lg font-bold text-amber-600">65%</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Optimization Score</p>
                              <p className="text-sm text-gray-500">Complete more tasks to improve</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleTaskComplete('optimize')}
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            data-testid="button-finish-setup"
                          >
                            Finish Setup
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
              })}

              {/* Complete Step Button */}
              <div className="pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={handleCompleteCurrentStep}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  data-testid="button-complete-step"
                >
                  Complete & Continue
                  <ArrowRight size={18} />
                </button>
                
                {currentStep.optional && (
                  <button
                    onClick={handleCompleteCurrentStep}
                    className="w-full mt-2 py-2 text-gray-500 text-sm hover:text-gray-700"
                    data-testid="button-skip-step"
                  >
                    Skip this step
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Developer Navigation */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
        <span className="text-gray-400 mr-2">Dev:</span>
        <span className="text-blue-400 font-medium">Unified Onboarding</span>
        <button
          onClick={() => setLocation('/')}
          className="px-3 py-1 bg-green-600 hover:bg-green-500 rounded transition-colors flex items-center gap-1"
          data-testid="dev-dashboard"
        >
          Dashboard <ArrowRight size={14} />
        </button>
      </div>

      {/* Data Source Modal */}
      <Dialog
        open={dataSourceModalOpen}
        onClose={() => setDataSourceModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Database size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Connect Data Source</h2>
              <p className="text-sm text-gray-500">Choose your preferred integration method</p>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="py-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => {
                setDataSourceType('sftp');
                setDataSourceModalOpen(false);
                setSalesDataModalOpen(true);
              }}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                dataSourceType === 'sftp' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Server size={32} className={dataSourceType === 'sftp' ? 'text-blue-600' : 'text-gray-400'} />
              <h3 className="mt-3 font-semibold text-gray-900">SFTP Upload</h3>
              <p className="text-sm text-gray-500 mt-1">Upload files via secure FTP</p>
            </button>
            
            <button
              onClick={() => setDataSourceType('api')}
              className={`p-6 rounded-xl border-2 text-left transition-all ${
                dataSourceType === 'api' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Link2 size={32} className={dataSourceType === 'api' ? 'text-blue-600' : 'text-gray-400'} />
              <h3 className="mt-3 font-semibold text-gray-900">API Integration</h3>
              <p className="text-sm text-gray-500 mt-1">Connect via REST API</p>
            </button>
          </div>
          
          {dataSourceType && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {dataSourceType === 'sftp' 
                  ? 'SFTP credentials will be generated for your secure file uploads.'
                  : 'API keys and documentation will be provided for integration.'}
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="p-4 border-t border-gray-100">
          <button
            onClick={() => setDataSourceModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setDataSourceModalOpen(false);
              if (currentStep) {
                dispatch({ type: 'COMPLETE_TASK', stepId: currentStep.id, taskId: 'datasource' });
              }
            }}
            disabled={!dataSourceType}
            className={`px-6 py-2 rounded-lg font-medium ${
              dataSourceType 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Connect
          </button>
        </DialogActions>
      </Dialog>

      {/* Sales Data Modal */}
      <Dialog 
        open={salesDataModalOpen} 
        onClose={() => setSalesDataModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: '1px solid #e5e7eb',
          pb: 2
        }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sales Data Settings</h2>
              <p className="text-sm text-gray-500">Configure your data source connection</p>
            </div>
          </div>
          <IconButton onClick={() => setSalesDataModalOpen(false)} size="small">
            <X className="w-5 h-5 text-gray-500" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Data Source Configuration
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Data Source Type</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.dataSourceType}
                    onChange={(e) => handleSalesConfigChange('dataSourceType', e.target.value)}
                  >
                    <option value="HTTP">HTTP</option>
                    <option value="FTP">FTP</option>
                    <option value="SFTP">SFTP</option>
                    <option value="S3">AWS S3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">File URL Type</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.fileUrlType}
                    onChange={(e) => handleSalesConfigChange('fileUrlType', e.target.value)}
                  >
                    <option value="File URL">File URL</option>
                    <option value="Folder Path">Folder Path</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-4">
                <p className="text-xs text-amber-800">
                  Will the provided URL overwrite existing data in the same folder with each update, or generate a new file every time? 
                  Note that creating a new file for each update could significantly extend the process as it requires individually locating and managing multiple files.
                </p>
              </div>

              <div className="space-y-4">
                <TextField
                  label="File URL"
                  value={salesConfig.fileUrl}
                  onChange={(e) => handleSalesConfigChange('fileUrl', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="https://example.com/data/sales.csv"
                />

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-medium text-gray-700">Dynamic URL Path</label>
                    <button 
                      onClick={addUrlSegment}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Plus size={12} />
                      Add Segment
                    </button>
                  </div>
                  <div className="space-y-2 mb-3">
                    {urlSegments.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">Add segments above to build your path</p>
                    ) : (
                      urlSegments.map((segment, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={segment}
                            onChange={(e) => updateUrlSegment(index, e.target.value)}
                            className="flex-1 p-2 border border-gray-200 rounded text-sm"
                            placeholder={`Segment ${index + 1}`}
                          />
                          <button 
                            onClick={() => removeUrlSegment(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="bg-white rounded border border-gray-200 p-2">
                    <span className="text-xs text-gray-500">Preview: </span>
                    <span className="text-xs font-mono text-gray-700">
                      {urlSegments.length > 0 ? `/${urlSegments.filter(s => s).join('/')}` : 'No path configured'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    We will search under this folder for files matching the provided 'File Regex' pattern below.
                    <br />
                    <span className="text-gray-400">Note: The "URL Segments" field will override the path in the main URL.</span>
                  </p>
                </div>

                <TextField
                  label="File Regex"
                  value={salesConfig.fileRegex}
                  onChange={(e) => handleSalesConfigChange('fileRegex', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="*.csv, store-sales-*, inventory-*.xml"
                  helperText="How to find files under folder path structure? You can use file extensions or specific file names such as *.csv, store-sales- or inventory-*.xml etc"
                />

                <TextField
                  label="Date Format of File Name"
                  value={salesConfig.dateFormat}
                  onChange={(e) => handleSalesConfigChange('dateFormat', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="YYYY-MM-DD"
                  helperText="Specify the date format used in the file name, e.g., YYYY-MM-DD"
                />

                <div className="bg-gray-50 rounded-lg p-3">
                  <span className="text-xs text-gray-500">Preview: </span>
                  <span className="text-xs font-mono text-red-500">
                    {salesConfig.fileUrl ? salesConfig.fileUrl : 'Invalid URL'}
                  </span>
                </div>

                <TextField
                  label="File Content Field Path"
                  value={salesConfig.contentFieldPath}
                  onChange={(e) => handleSalesConfigChange('contentFieldPath', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="$.list.datas or $.items"
                  helperText="How to access the desired content inside the file? You can think of it as XML files xpath feature, such as $.list.datas or $.items"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Scheduler</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Frequency</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.schedulerFrequency}
                    onChange={(e) => handleSalesConfigChange('schedulerFrequency', e.target.value)}
                  >
                    <option value="HOURLY">HOURLY</option>
                    <option value="DAILY">DAILY</option>
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="MONTHLY">MONTHLY</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                    value={salesConfig.schedulerTime}
                    onChange={(e) => handleSalesConfigChange('schedulerTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Time Zone</label>
                  <select 
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    value={salesConfig.timezone}
                    onChange={(e) => handleSalesConfigChange('timezone', e.target.value)}
                  >
                    <option value="Europe/Istanbul">Europe/Istanbul</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="America/New_York">America/New York</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">User Authentication</h3>
              <p className="text-xs text-gray-500 mb-4">(Optional)</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <TextField
                  label="Username"
                  value={salesConfig.username}
                  onChange={(e) => handleSalesConfigChange('username', e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Password"
                  type="password"
                  value={salesConfig.password}
                  onChange={(e) => handleSalesConfigChange('password', e.target.value)}
                  fullWidth
                  size="small"
                />
              </div>
              <TextField
                label="Private Key"
                value={salesConfig.privateKey}
                onChange={(e) => handleSalesConfigChange('privateKey', e.target.value)}
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="Paste the content of .pem file here"
                helperText="You can paste here the content of .pem file if accessing requires private key"
              />
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900 mb-1">IP Restrictions</h4>
                  <p className="text-xs text-blue-700 mb-2">For enhanced security, you can enable IP-based restrictions by allowing access only to the following IP addresses:</p>
                  <div className="flex flex-wrap gap-2">
                    <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 border border-blue-200">18.197.128.133</code>
                    <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 border border-blue-200">18.197.126.156</code>
                    <code className="px-2 py-1 bg-white rounded text-xs font-mono text-gray-700 border border-blue-200">3.65.9.112</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #e5e7eb', p: 3 }}>
          <button 
            onClick={() => setSalesDataModalOpen(false)}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              setSalesDataModalOpen(false);
              if (currentStep) {
                dispatch({ type: 'COMPLETE_TASK', stepId: currentStep.id, taskId: 'datasource' });
              }
            }}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Save Configuration
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
