import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Building2,
  Users,
  Mail,
  Plus,
  X,
  ArrowRight,
  Zap,
  ShoppingBag,
  Car,
  Hotel,
  Check,
  Sparkles
} from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  role: string;
}

const sectors = [
  { id: 'retail', name: 'Retail', icon: ShoppingBag, description: 'Mağaza ve perakende zincirleri' },
  { id: 'automotive', name: 'Automotive', icon: Car, description: 'Otomotiv bayileri ve servisler' },
  { id: 'hospitality', name: 'Hospitality', icon: Hotel, description: 'Otel, restoran ve konaklama' },
];

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const [companyName, setCompanyName] = useState('');
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('viewer');
  const [showTeamSection, setShowTeamSection] = useState(false);
  const [integrationId] = useState(() => Math.floor(10000 + Math.random() * 90000));
  const [logoLoading, setLogoLoading] = useState(false);

  // Simulate logo fetching when company name changes
  useEffect(() => {
    if (companyName.length > 2) {
      setLogoLoading(true);
      const timer = setTimeout(() => {
        // Simulate fetched logo using company initial
        setCompanyLogo(companyName.charAt(0).toUpperCase());
        setLogoLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setCompanyLogo(null);
    }
  }, [companyName]);

  const addTeamMember = () => {
    if (newMemberEmail && newMemberEmail.includes('@')) {
      setTeamMembers([
        ...teamMembers,
        { id: Date.now().toString(), email: newMemberEmail, role: newMemberRole }
      ]);
      setNewMemberEmail('');
      setNewMemberRole('viewer');
    }
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handleContinue = () => {
    // Navigate to next step
    setLocation('/');
  };

  const isFormValid = companyName.length > 0 && selectedSector !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">VenueX Data Bridge</h1>
                <p className="text-xs text-gray-500">Adım 1/3 • Workspace Kurulumu</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Building2 size={16} />
            Kurumsal Kimlik
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            VenueX Workspace Oluştur
          </h2>
          <p className="text-gray-600">
            Şirketinizi tanıyalım ve size özel bir çalışma alanı hazırlayalım
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xl shadow-gray-100/50 overflow-hidden">
          <div className="p-8 space-y-8">
            {/* Company Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Firma Adı
              </label>
              <div className="flex gap-4">
                {/* Logo Preview */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                    companyLogo 
                      ? 'border-blue-300 bg-gradient-to-br from-blue-500 to-indigo-600' 
                      : 'border-gray-300 bg-gray-50'
                  }`}>
                    {logoLoading ? (
                      <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
                    ) : companyLogo ? (
                      <span className="text-2xl font-bold text-white">{companyLogo}</span>
                    ) : (
                      <Building2 className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Input */}
                <div className="flex-1">
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Firma adınızı girin"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    data-testid="input-company-name"
                  />
                  {companyName.length > 2 && !logoLoading && (
                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <Check size={12} />
                      Logo otomatik olarak algılandı
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Sector Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Sektör
              </label>
              <div className="grid grid-cols-3 gap-4">
                {sectors.map((sector) => {
                  const IconComponent = sector.icon;
                  const isSelected = selectedSector === sector.id;
                  return (
                    <button
                      key={sector.id}
                      onClick={() => setSelectedSector(sector.id)}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      data-testid={`button-sector-${sector.id}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                        isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <IconComponent size={20} />
                      </div>
                      <h4 className={`font-semibold mb-1 ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                        {sector.name}
                      </h4>
                      <p className="text-xs text-gray-500">{sector.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Team Invitation Section */}
            <div className="border-t border-gray-100 pt-6">
              <button
                onClick={() => setShowTeamSection(!showTeamSection)}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                data-testid="button-toggle-team"
              >
                <Users size={18} />
                Teknik ekibini şimdiden davet et
                <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                  Opsiyonel
                </span>
              </button>

              {showTeamSection && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4">
                  {/* Existing Team Members */}
                  {teamMembers.length > 0 && (
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div 
                          key={member.id}
                          className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                              {member.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{member.email}</p>
                              <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeTeamMember(member.id)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <X size={16} className="text-gray-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Member */}
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="ekip@sirket.com"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        data-testid="input-team-email"
                      />
                    </div>
                    <select
                      value={newMemberRole}
                      onChange={(e) => setNewMemberRole(e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      data-testid="select-team-role"
                    >
                      <option value="viewer">Viewer</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={addTeamMember}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      data-testid="button-add-team-member"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles size={16} className="text-blue-500" />
                <span>
                  Integration ID: <span className="font-mono font-semibold text-gray-700">#{integrationId}</span>
                </span>
              </div>
              <button
                onClick={handleContinue}
                disabled={!isFormValid}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  isFormValid
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                data-testid="button-continue"
              >
                Devam Et
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Trust Message */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            İstediğiniz zaman kaldığınız yerden devam edebilirsiniz.
          </p>
        </div>
      </main>
    </div>
  );
}
