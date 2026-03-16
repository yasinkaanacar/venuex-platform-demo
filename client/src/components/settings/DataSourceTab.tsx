import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  CloudUpload,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Plus,
  X,
  Type,
  Zap,
  Upload,
  Eye,
  Shield,
} from 'lucide-react';
import { useTranslation } from '@/contexts/LanguageContext';
import SettingsSectionCard from '@/components/settings/SettingsSectionCard';
import SettingsFieldGroup from '@/components/settings/SettingsFieldGroup';
import SettingsFormRow from '@/components/settings/SettingsFormRow';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────────

type FileUrlType = 'filePath' | 'folderPath' | 'apiEndpoint';
type SchedulerFrequency = 'daily' | 'weekly' | 'monthly' | 'hourly';

interface UrlSegment {
  type: 'static' | 'dynamic';
  value: string;
}

interface DataSourceFormState {
  sourceType: string;
  fileUrlType: FileUrlType;
  fileUrl: string;
  urlSegments: UrlSegment[];
  fileRegex: string;
  dateFormat: string;
  contentPath: string;
  scheduler: SchedulerFrequency;
  schedulerTime: string;
  timezone: string;
  username: string;
  password: string;
  privateKey: string;
}

const INITIAL_FORM: DataSourceFormState = {
  sourceType: 'HTTP',
  fileUrlType: 'filePath',
  fileUrl: '',
  urlSegments: [],
  fileRegex: '',
  dateFormat: '',
  contentPath: '',
  scheduler: 'daily',
  schedulerTime: '02:00',
  timezone: '',
  username: '',
  password: '',
  privateKey: '',
};

const INPUT_CLS =
  'w-full h-9 px-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

const SELECT_CLS =
  'w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

// ─── Collapsible Section ────────────────────────────────────────────────────────

function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  badge,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        {open ? (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        )}
        <span className="text-gray-500 flex-shrink-0">{icon}</span>
        <span className="text-sm font-medium text-gray-800 flex-1">{title}</span>
        {badge}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 bg-white border-t border-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── URL Segment Builder ────────────────────────────────────────────────────────

function UrlSegmentBuilder({
  segments,
  onChange,
  ds,
}: {
  segments: UrlSegment[];
  onChange: (segs: UrlSegment[]) => void;
  ds: any;
}) {
  const addSegment = (type: 'static' | 'dynamic') =>
    onChange([...segments, { type, value: '' }]);

  const removeSegment = (idx: number) =>
    onChange(segments.filter((_, i) => i !== idx));

  const updateSegment = (idx: number, value: string) => {
    const next = [...segments];
    next[idx] = { ...next[idx], value };
    onChange(next);
  };

  const preview = segments.length > 0
    ? segments.map((s) => (s.type === 'dynamic' ? `{${s.value || 'date'}}` : s.value)).join('/')
    : null;

  return (
    <div className="space-y-2.5">
      {/* Add buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => addSegment('static')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <Type className="w-3 h-3" />
          {ds?.staticText || 'Static Text'}
        </button>
        <button
          type="button"
          onClick={() => addSegment('dynamic')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-md hover:bg-gray-50 text-gray-700 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <Calendar className="w-3 h-3" />
          {ds?.dynamicDate || 'Dynamic Date'}
        </button>
      </div>

      {/* Segment inputs */}
      {segments.map((seg, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide flex-shrink-0 w-16 justify-center',
              seg.type === 'static'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-amber-50 text-amber-600',
            )}
          >
            {seg.type === 'static' ? 'Static' : 'Date'}
          </span>
          <input
            type="text"
            className={cn(INPUT_CLS, 'flex-1')}
            placeholder={seg.type === 'static' ? '/data/exports' : 'YYYY-MM-DD'}
            value={seg.value}
            onChange={(e) => updateSegment(idx, e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeSegment(idx)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {/* Preview */}
      {preview && (
        <div className="flex items-start gap-2 px-3 py-2 bg-gray-50 rounded-lg">
          <Eye className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs text-gray-500">{ds?.preview || 'Preview'}: </span>
            <span className="text-xs font-mono text-gray-700">{preview}</span>
          </div>
        </div>
      )}

      {segments.length > 0 && (
        <p className="text-[11px] text-amber-600 flex items-center gap-1">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />
          {ds?.dynamicUrlWarning || 'URL segments will override the base file URL path.'}
        </p>
      )}
    </div>
  );
}

// ─── Data Source Form (inline) ──────────────────────────────────────────────────

function DataSourceForm({ category, oc }: { category: 'sales' | 'inventory'; oc: any }) {
  const ds = oc?.dataSource?.sourceDialog;
  const [form, setForm] = useState<DataSourceFormState>(INITIAL_FORM);
  const [testResult, setTestResult] = useState<'success' | 'error' | 'testing' | null>(null);
  const [mappingFile, setMappingFile] = useState<string | null>(null);

  const updateField = (field: keyof DataSourceFormState, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const showFolderFields = form.fileUrlType === 'folderPath';

  return (
    <div className="space-y-4">
      {/* ── 1. Connection ─────────────────────────────────── */}
      <CollapsibleSection
        title={ds?.heading || 'Data Source Connection'}
        icon={<Zap className="w-4 h-4" />}
        defaultOpen
        badge={
          testResult === 'success' ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3" /> {ds?.testSuccess || 'Connected'}
            </span>
          ) : null
        }
      >
        <div className="divide-y divide-gray-100">
          <SettingsFormRow label={ds?.sourceType || 'Source Type'}>
            <select
              className={SELECT_CLS}
              value={form.sourceType}
              onChange={(e) => updateField('sourceType', e.target.value)}
            >
              <option value="HTTP">HTTP</option>
              <option value="SFTP">SFTP</option>
              <option value="FTP">FTP</option>
              <option value="S3">Amazon S3</option>
              <option value="GCS">Google Cloud Storage</option>
            </select>
          </SettingsFormRow>

          <SettingsFormRow
            label={ds?.fileUrlType || 'URL Type'}
            hint={ds?.fileUrlTypeDesc || 'How should we access your data?'}
          >
            <div className="flex items-center gap-4 pt-1">
              {(['filePath', 'folderPath', 'apiEndpoint'] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name={`fileUrlType-${category}`}
                    checked={form.fileUrlType === type}
                    onChange={() => updateField('fileUrlType', type)}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">
                    {type === 'filePath'
                      ? (ds?.filePath || 'File Path')
                      : type === 'folderPath'
                        ? (ds?.folderPath || 'Folder Path')
                        : (ds?.apiEndpoint || 'API Endpoint')}
                  </span>
                </label>
              ))}
            </div>
          </SettingsFormRow>

          <SettingsFormRow label={ds?.fileUrl || 'File URL'} required>
            <input
              type="text"
              className={INPUT_CLS}
              placeholder="https://data.example.com/exports/sales.csv"
              value={form.fileUrl}
              onChange={(e) => updateField('fileUrl', e.target.value)}
            />
          </SettingsFormRow>

          {/* Dynamic URL — only for Folder Path */}
          {showFolderFields && (
            <SettingsFormRow
              label={ds?.dynamicUrlPath || 'Dynamic Path'}
              hint={ds?.dynamicUrlDesc || "Build a path pattern to find the latest file in the folder."}
            >
              <UrlSegmentBuilder
                segments={form.urlSegments}
                onChange={(segs) => setForm((prev) => ({ ...prev, urlSegments: segs }))}
                ds={ds}
              />
            </SettingsFormRow>
          )}

          {/* File Regex — only for Folder Path */}
          {showFolderFields && (
            <SettingsFormRow
              label={ds?.fileRegex || 'File Regex'}
              hint={ds?.fileRegexDesc || "Pattern to match files, e.g. '*.csv', 'sales-*.xml'"}
            >
              <input
                type="text"
                className={INPUT_CLS}
                placeholder="*.csv"
                value={form.fileRegex}
                onChange={(e) => updateField('fileRegex', e.target.value)}
              />
            </SettingsFormRow>
          )}

          {/* Date Format — only for Folder Path */}
          {showFolderFields && (
            <SettingsFormRow
              label={ds?.dateFormat || 'Filename Date Format'}
              hint={ds?.dateFormatDesc || "Date pattern used in filenames, e.g. 'YYYY-MM-DD'."}
            >
              <select
                className={SELECT_CLS}
                value={form.dateFormat}
                onChange={(e) => updateField('dateFormat', e.target.value)}
              >
                <option value="">{ds?.selectDateFormat || 'Select format...'}</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                <option value="MM-DD-YYYY">MM-DD-YYYY</option>
                <option value="YYYYMMDD">YYYYMMDD</option>
                <option value="DD.MM.YYYY">DD.MM.YYYY</option>
              </select>
            </SettingsFormRow>
          )}

          <SettingsFormRow
            label={ds?.contentPath || 'Content Path'}
            hint={ds?.contentPathDesc || "JSONPath or XPath to the data array, e.g. '$.list.items'"}
          >
            <input
              type="text"
              className={INPUT_CLS}
              placeholder="$.data.items"
              value={form.contentPath}
              onChange={(e) => updateField('contentPath', e.target.value)}
            />
          </SettingsFormRow>
        </div>
      </CollapsibleSection>

      {/* ── 2. Scheduling ─────────────────────────────────── */}
      <CollapsibleSection
        title={ds?.scheduler || 'Scheduling'}
        icon={<Clock className="w-4 h-4" />}
      >
        <div className="divide-y divide-gray-100">
          <SettingsFormRow label={ds?.scheduler || 'Frequency'}>
            <select
              className={SELECT_CLS}
              value={form.scheduler}
              onChange={(e) => updateField('scheduler', e.target.value as SchedulerFrequency)}
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </SettingsFormRow>

          <SettingsFormRow label={ds?.schedulerTime || 'Run Time'}>
            <input
              type="time"
              className={cn(INPUT_CLS, 'w-32')}
              value={form.schedulerTime}
              onChange={(e) => updateField('schedulerTime', e.target.value)}
            />
          </SettingsFormRow>

          <SettingsFormRow label={ds?.timezone || 'Timezone'}>
            <select
              className={SELECT_CLS}
              value={form.timezone}
              onChange={(e) => updateField('timezone', e.target.value)}
            >
              <option value="">—</option>
              <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
              <option value="Europe/London">Europe/London (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (UTC-8)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
            </select>
          </SettingsFormRow>
        </div>
      </CollapsibleSection>

      {/* ── 3. Authentication (optional) ──────────────────── */}
      <CollapsibleSection
        title={ds?.auth || 'Authentication'}
        icon={<Shield className="w-4 h-4" />}
        badge={
          <span className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
            {ds?.optional || 'Optional'}
          </span>
        }
      >
        <div className="divide-y divide-gray-100">
          <SettingsFormRow label={ds?.username || 'Username'}>
            <input
              type="text"
              className={INPUT_CLS}
              placeholder={ds?.username || 'Username'}
              value={form.username}
              onChange={(e) => updateField('username', e.target.value)}
            />
          </SettingsFormRow>

          <SettingsFormRow label={ds?.password || 'Password'}>
            <input
              type="password"
              className={INPUT_CLS}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
            />
          </SettingsFormRow>

          <SettingsFormRow
            label={ds?.privateKey || 'Private Key'}
            hint={ds?.privateKeyDesc || 'Paste .pem file contents if required'}
          >
            <textarea
              className="w-full px-3 py-2 text-sm font-mono border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              placeholder="-----BEGIN RSA PRIVATE KEY-----"
              value={form.privateKey}
              onChange={(e) => updateField('privateKey', e.target.value)}
            />
          </SettingsFormRow>
        </div>

        {/* IP whitelist info */}
        <div className="mt-3 px-3 py-2.5 bg-blue-50 rounded-lg">
          <p className="text-[11px] text-blue-700 mb-1.5">
            {ds?.ipWhitelistDesc || 'Whitelist these IPs for enhanced security:'}
          </p>
          <div className="flex items-center gap-3">
            {['18.197.128.133', '18.197.126.156', '3.65.9.112'].map((ip) => (
              <code key={ip} className="text-[11px] font-mono text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded">
                {ip}
              </code>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* ── 4. Field Mapping ──────────────────────────────── */}
      <CollapsibleSection
        title={oc?.dataSource?.mapData || 'Field Mapping'}
        icon={<Upload className="w-4 h-4" />}
        badge={
          mappingFile ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700">
              {mappingFile}
            </span>
          ) : null
        }
      >
        <div className="space-y-3">
          <p className="text-xs text-gray-500">
            {oc?.dataSource?.mapDialog?.description ||
              'Upload a sample file and the system will auto-suggest column mappings based on your column names.'}
          </p>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors">
              <CloudUpload className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {oc?.dataSource?.mapDialog?.browseFile || 'Choose sample file'}
              </span>
              <input
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls,.json,.xml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setMappingFile(file.name);
                }}
              />
            </label>
            {mappingFile && (
              <button
                type="button"
                className="px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                {oc?.dataSource?.mapDialog?.submitFile || 'Analyze & Map'}
              </button>
            )}
          </div>

          {!mappingFile && (
            <p className="text-[11px] text-gray-400">
              Supported formats: CSV, XLSX, JSON, XML
            </p>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Action bar ────────────────────────────────────── */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="button"
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
            testResult === 'testing'
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'border border-gray-200 text-gray-700 hover:bg-gray-50',
          )}
          disabled={testResult === 'testing' || !form.fileUrl}
          onClick={() => {
            setTestResult('testing');
            setTimeout(() => setTestResult('success'), 1200);
          }}
        >
          {testResult === 'testing'
            ? (ds?.testing || 'Testing...')
            : (ds?.testConnection || 'Test Connection')}
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          {ds?.save || 'Save'}
        </button>

        {/* Inline test result */}
        {testResult === 'success' && (
          <span className="inline-flex items-center gap-1.5 text-xs text-green-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {ds?.testSuccess || 'Connection successful'}
          </span>
        )}
        {testResult === 'error' && (
          <span className="inline-flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="w-3.5 h-3.5" />
            {ds?.testError || 'Connection failed'}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── DataSourceTab ──────────────────────────────────────────────────────────────

export default function DataSourceTab() {
  const { t } = useTranslation();
  const oc = t.settings as any;

  return (
    <div className="space-y-6">
      {/* Sales Data Settings */}
      <SettingsSectionCard
        title={oc?.dataSource?.salesSection || 'Sales Data Settings'}
        description={oc?.dataSource?.salesDesc || 'Configure how sales data flows into VenueX'}
      >
        <SettingsFieldGroup>
          <DataSourceForm category="sales" oc={oc} />
        </SettingsFieldGroup>
      </SettingsSectionCard>

      {/* Inventory Data Settings */}
      <SettingsSectionCard
        title={oc?.dataSource?.inventorySection || 'Inventory Data Settings'}
        description={oc?.dataSource?.inventoryDesc || 'Configure how inventory data flows into VenueX'}
      >
        <SettingsFieldGroup>
          <DataSourceForm category="inventory" oc={oc} />
        </SettingsFieldGroup>
      </SettingsSectionCard>

      {/* Store Data Settings */}
      <SettingsSectionCard
        title={oc?.dataSource?.storeDataSection || 'Store Data Settings'}
        description={
          oc?.dataSource?.storeDataImportDesc ||
          'Import your store location file and map fields to match the VenueX database.'
        }
      >
        <SettingsFieldGroup>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CloudUpload className="w-4 h-4" />
              {oc?.dataSource?.importLocations || 'Import Locations'}
            </button>
            <p className="text-xs text-gray-500">
              {oc?.dataSource?.storeDataDesc || 'Import and manage store-level data'}
            </p>
          </div>
        </SettingsFieldGroup>
      </SettingsSectionCard>
    </div>
  );
}
