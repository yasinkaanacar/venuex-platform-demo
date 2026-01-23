import { Check, Building2, MapPin, Target, Database, Gauge } from 'lucide-react';
import { Link } from 'wouter';

interface Step {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: typeof Building2;
}

const steps: Step[] = [
  { id: 1, name: 'The Handshake', description: 'Company Setup', href: '/onboarding', icon: Building2 },
  { id: 2, name: 'The Sync Hub', description: 'Location Sync', href: '/onboarding/step2', icon: MapPin },
  { id: 3, name: 'The Value Bridge', description: 'Attribution', href: '/onboarding/step3', icon: Target },
  { id: 4, name: 'The Data Mapper', description: 'Data Connection', href: '/onboarding/step4', icon: Database },
  { id: 5, name: 'The Cockpit', description: 'Optimization', href: '/onboarding/step5', icon: Gauge },
];

interface StepsSidebarProps {
  currentStep: number;
}

export default function StepsSidebar({ currentStep }: StepsSidebarProps) {
  return (
    <div className="w-[30%] min-w-[280px] bg-gray-50 border-l border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Setup Progress</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600">{currentStep}/{steps.length}</span>
        </div>
      </div>

      <nav className="space-y-2">
        {steps.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isUpcoming = step.id > currentStep;
          const Icon = step.icon;

          return (
            <Link key={step.id} href={step.href}>
              <div
                className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  isCurrent 
                    ? 'bg-blue-50 border border-blue-200' 
                    : isCompleted 
                      ? 'hover:bg-gray-100' 
                      : 'opacity-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <Icon size={16} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    isCurrent ? 'text-blue-900' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {step.name}
                  </p>
                  <p className={`text-xs ${
                    isCurrent ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
                {isCompleted && (
                  <div className="text-xs text-green-600 font-medium">Done</div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
