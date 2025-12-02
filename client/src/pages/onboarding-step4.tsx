import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowRight,
  ArrowLeft,
  Zap,
  Upload,
  FileSpreadsheet,
  Server,
  Lock,
  Check,
  ChevronDown,
  Link2,
  ShieldCheck,
  Database,
  X,
  Settings,
  Plus,
  Shield,
  Users,
  Mail,
  Copy
} from 'lucide-react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton } from '@mui/material';
import StepsSidebar from '@/components/onboarding/steps-sidebar';

interface FieldMapping {
  venueXField: string;
  venueXLabel: string;
  userField: string;
  required: boolean;
}

const venueXFields: FieldMapping[] = [
  { venueXField: 'transaction_id', venueXLabel: 'Transaction ID', userField: '', required: true },
  { venueXField: 'conversion_value', venueXLabel: 'Conversion Value', userField: '', required: true },
  { venueXField: 'conversion_time', venueXLabel: 'Conversion Time', userField: '', required: true },
  { venueXField: 'email_hash', venueXLabel: 'Email (Auto-hashed)', userField: '', required: false },
  { venueXField: 'phone_hash', venueXLabel: 'Phone (Auto-hashed)', userField: '', required: false },
  { venueXField: 'store_code', venueXLabel: 'Store Code', userField: '', required: true },
];

const mockCSVHeaders = [
  'Order_ID',
  'Total_Amount',
  'Date_Time',
  'Customer_Email',
  'Customer_Phone',
  'Branch_Code',
  'Product_SKU',
  'Quantity',
  'Payment_Method',
];

export default function OnboardingStep4Page() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'api' | null>(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [mappings, setMappings] = useState<FieldMapping[]>(venueXFields);
  const [integrationId] = useState(() => Math.floor(10000 + Math.random() * 90000));
  const [dataSourceModalOpen, setDataSourceModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const [urlSegments, setUrlSegments] = useState<string[]>([]);
  const [salesConfig, setSalesConfig] = useState({
    dataSourceType: 'SFTP',
    fileUrlType: 'File URL',
    fileUrl: '',
    fileRegex: '',
    dateFormat: '',
    contentFieldPath: '',
    schedulerFrequency: 'DAILY',
    schedulerTime: '03:00',
    timezone: 'Europe/Istanbul',
    username: '',
    password: '',
    privateKey: ''
  });

  const handleSalesConfigChange = (field: string, value: string) => {
    setSalesConfig(prev => ({ ...prev, [field]: value }));
  };

  const addUrlSegment = () => {
    setUrlSegments(prev => [...prev, '']);
  };

  const updateUrlSegment = (index: number, value: string) => {
    setUrlSegments(prev => prev.map((seg, i) => i === index ? value : seg));
  };

  const removeUrlSegment = (index: number) => {
    setUrlSegments(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      simulateUpload(file.name);
    }
  };

  const simulateUpload = (name: string) => {
    setFileName(name);
    setTimeout(() => {
      setFileUploaded(true);
      setCurrentStep(2);
      // Auto-map some fields for demo
      setMappings([
        { ...venueXFields[0], userField: 'Order_ID' },
        { ...venueXFields[1], userField: 'Total_Amount' },
        { ...venueXFields[2], userField: 'Date_Time' },
        { ...venueXFields[3], userField: 'Customer_Email' },
        { ...venueXFields[4], userField: 'Customer_Phone' },
        { ...venueXFields[5], userField: 'Branch_Code' },
      ]);
    }, 1000);
  };

  const updateMapping = (index: number, userField: string) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], userField };
    setMappings(newMappings);
  };

  const handleFinish = () => {
    setLocation('/onboarding/step5');
  };

  const requiredFieldsMapped = mappings
    .filter(m => m.required)
    .every(m => m.userField !== '');

  return (
    <div className="min-h-screen bg-white flex">
      {/* Main Content Area - 70% */}
      <div className="w-[70%]">
        {/* Developer Navigation */}
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
          <span className="text-gray-400 mr-2">Dev:</span>
          <button
            onClick={() => setLocation('/onboarding/step3')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
            data-testid="dev-back"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <span className="text-blue-400 font-medium">Step 4</span>
          <button
            onClick={() => setLocation('/onboarding/step5')}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded transition-colors flex items-center gap-1"
            data-testid="dev-next"
          >
            Next <ArrowRight size={14} />
          </button>
        </div>

        {/* Header */}
        <header className="border-b border-gray-100">
          <div className="max-w-5xl mx-auto px-6 py-4">
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

      {/* Step Indicator */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep > 1 ? 'bg-blue-600 text-white' : currentStep === 1 ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? <Check size={16} /> : '1'}
              </div>
              <span className="font-medium">Data Source</span>
            </div>
            
            <div className="flex-1 h-px bg-gray-300" />
            
            <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 2 ? 'bg-blue-100 text-blue-600 border-2 border-blue-600' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="font-medium">Mapping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Headline */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Map your offline sales data.
          </h1>
          <p className="text-gray-500">
            Match your file columns to VenueX fields. We automatically hash PII (Email/Phone) via SHA-256 for privacy compliance.
          </p>
        </div>

        {/* Step 1: Data Source */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A: File Upload */}
            <div
              className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer ${
                uploadMethod === 'file' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }`}
              onClick={() => setUploadMethod('file')}
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FileSpreadsheet size={24} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Upload Sales File</h3>
                  <p className="text-sm text-gray-500">CSV or Excel format</p>
                </div>
              </div>

              {uploadMethod === 'file' && (
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-white hover:bg-blue-50 transition-colors"
                >
                  <Upload size={32} className="mx-auto text-blue-400 mb-3" />
                  <p className="text-gray-600 mb-2">Drag & drop your file here</p>
                  <p className="text-sm text-gray-400 mb-4">or</p>
                  <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors inline-block">
                    Browse Files
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileSelect}
                      className="hidden"
                      data-testid="input-file-upload"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Option B: API/SFTP */}
            <div
              className="relative p-6 rounded-xl border-2 transition-all cursor-pointer border-gray-200 hover:border-purple-300 hover:shadow-lg"
              onClick={() => setDataSourceModalOpen(true)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Server size={24} className="text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">API / SFTP Connection</h3>
                  <p className="text-sm text-gray-500">Automated data sync</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInviteModalOpen(true);
                    }}
                    className="mt-3 text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    data-testid="button-invite-technical-team"
                  >
                    <Users size={14} />
                    Invite Technical Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Mapping Interface */}
        {currentStep === 2 && (
          <div>
            {/* File Info */}
            <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <Check size={20} className="text-green-600" />
              <div>
                <p className="font-medium text-green-800">File uploaded: {fileName}</p>
                <p className="text-sm text-green-600">Detected {mockCSVHeaders.length} columns</p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <ShieldCheck size={20} className="text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Privacy-First Processing</p>
                <p className="text-sm text-blue-600">Email and Phone fields are automatically hashed with SHA-256 client-side before transmission. Your raw PII never leaves your browser.</p>
              </div>
            </div>

            {/* Mapping Table */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-[1fr,auto,1fr] gap-4 p-4 bg-gray-100 border-b border-gray-200">
                <div className="font-medium text-gray-700 text-sm uppercase tracking-wide">VenueX Field</div>
                <div className="w-12" />
                <div className="font-medium text-gray-700 text-sm uppercase tracking-wide">Your File Column</div>
              </div>

              <div className="divide-y divide-gray-200">
                {mappings.map((mapping, index) => (
                  <div key={mapping.venueXField} className="grid grid-cols-[1fr,auto,1fr] gap-4 p-4 items-center">
                    {/* VenueX Field */}
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${mapping.required ? 'bg-red-500' : 'bg-gray-300'}`} />
                      <div>
                        <p className="font-medium text-gray-900">{mapping.venueXLabel}</p>
                        {mapping.venueXField.includes('hash') && (
                          <span className="text-xs text-blue-600 flex items-center gap-1">
                            <Lock size={10} /> SHA-256
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Connection Line */}
                    <div className="flex items-center justify-center w-12">
                      <div className={`h-px w-full ${mapping.userField ? 'bg-green-400' : 'bg-gray-300'}`} />
                      <Link2 size={16} className={mapping.userField ? 'text-green-500' : 'text-gray-300'} />
                      <div className={`h-px w-full ${mapping.userField ? 'bg-green-400' : 'bg-gray-300'}`} />
                    </div>

                    {/* User Field Dropdown */}
                    <div className="relative">
                      <select
                        value={mapping.userField}
                        onChange={(e) => updateMapping(index, e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg border appearance-none cursor-pointer ${
                          mapping.userField 
                            ? 'border-green-300 bg-green-50 text-green-800' 
                            : 'border-gray-300 bg-white text-gray-600'
                        }`}
                        data-testid={`select-mapping-${mapping.venueXField}`}
                      >
                        <option value="">Select column...</option>
                        {mockCSVHeaders.map(header => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span>Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-300" />
                <span>Optional</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-10 flex justify-end">
          <button
            onClick={handleFinish}
            disabled={currentStep === 2 && !requiredFieldsMapped}
            className={`px-8 py-4 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              (currentStep === 1) || (currentStep === 2 && requiredFieldsMapped)
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            data-testid="button-process-finish"
          >
            {currentStep === 2 ? 'Process Data & Finish' : 'Continue'}
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      {/* Connect Data Source Modal */}
      <Dialog 
        open={dataSourceModalOpen} 
        onClose={() => setDataSourceModalOpen(false)}
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
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Database className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Connect Data Source</h2>
              <p className="text-sm text-gray-500">Configure your API/SFTP connection</p>
            </div>
          </div>
          <IconButton onClick={() => setDataSourceModalOpen(false)} size="small">
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
                </div>

                <TextField
                  label="File Regex"
                  value={salesConfig.fileRegex}
                  onChange={(e) => handleSalesConfigChange('fileRegex', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="*.csv, store-sales-*, inventory-*.xml"
                  helperText="File extensions or patterns such as *.csv, store-sales-*, inventory-*.xml"
                />

                <TextField
                  label="Date Format of File Name"
                  value={salesConfig.dateFormat}
                  onChange={(e) => handleSalesConfigChange('dateFormat', e.target.value)}
                  fullWidth
                  size="small"
                  placeholder="YYYY-MM-DD"
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
                  <p className="text-xs text-blue-700 mb-2">For enhanced security, allow access only to these IP addresses:</p>
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
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
          <button
            onClick={() => setDataSourceModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setDataSourceModalOpen(false);
              setLocation('/onboarding/step5');
            }}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Save & Continue
          </button>
        </DialogActions>
      </Dialog>

      {/* Invite Technical Team Modal */}
      <Dialog 
        open={inviteModalOpen} 
        onClose={() => {
          setInviteModalOpen(false);
          setInviteSent(false);
          setInviteEmail('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px'
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
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Invite Technical Team</h2>
              <p className="text-sm text-gray-500">Send setup instructions to your IT team</p>
            </div>
          </div>
          <IconButton onClick={() => {
            setInviteModalOpen(false);
            setInviteSent(false);
            setInviteEmail('');
          }} size="small">
            <X className="w-5 h-5 text-gray-500" />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ pt: 3 }}>
          {!inviteSent ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Your technical team will receive an email with API credentials, documentation, and setup instructions.
              </p>
              
              <TextField
                label="Team Member Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                fullWidth
                size="small"
                placeholder="developer@company.com"
                type="email"
              />

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">What they'll receive:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    API credentials and SFTP access
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Data format specifications
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    Integration documentation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check size={14} className="text-green-500" />
                    IP whitelist requirements
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500 mb-2">Or share the setup link directly:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono text-gray-700 truncate">
                    https://venuex.io/setup/{integrationId}
                  </code>
                  <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                    <Copy size={16} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Invitation Sent!</h3>
              <p className="text-sm text-gray-600">
                We've sent setup instructions to <span className="font-medium">{inviteEmail}</span>
              </p>
            </div>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: '1px solid #e5e7eb' }}>
          {!inviteSent ? (
            <>
              <button
                onClick={() => {
                  setInviteModalOpen(false);
                  setInviteEmail('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setInviteSent(true)}
                disabled={!inviteEmail}
                className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  inviteEmail 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Mail size={16} />
                Send Invitation
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setInviteModalOpen(false);
                setInviteSent(false);
                setInviteEmail('');
              }}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
            >
              Done
            </button>
          )}
        </DialogActions>
      </Dialog>
      </div>

      {/* Steps Sidebar - 30% */}
      <StepsSidebar currentStep={4} />
    </div>
  );
}
