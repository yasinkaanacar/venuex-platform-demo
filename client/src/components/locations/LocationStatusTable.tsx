import { SiGoogle, SiMeta, SiApple } from 'react-icons/si';
import { Clock, AlertTriangle, Phone, Mail, MapPin, Image, ShieldCheck, ShieldAlert, XCircle, PauseCircle } from 'lucide-react';

type WarningType = 'phone_missing' | 'email_missing' | 'address_error' | 'image_missing' | 'sync_error';

interface LocationWarning {
  type: WarningType;
  label: string;
}

type PlatformStatusType = 'verified' | 'unverified' | 'action_required' | 'fully_passive' | 'temporarily_passive';

interface PlatformData {
  status: PlatformStatusType;
  lastSync: string | null;
  warnings: LocationWarning[];
}

interface LocationData {
  id: number;
  name: string;
  address: string;
  google: PlatformData;
  meta: PlatformData;
  apple: PlatformData;
  yandex: PlatformData;
}

const mockLocations: LocationData[] = [
  {
    id: 1,
    name: 'İstanbul - Kadıköy',
    address: 'Caferağa Mah. Moda Cad. No:12',
    google: { status: 'verified', lastSync: '2 dk önce', warnings: [] },
    meta: { status: 'verified', lastSync: '5 dk önce', warnings: [] },
    apple: { status: 'verified', lastSync: '10 dk önce', warnings: [] },
    yandex: { status: 'verified', lastSync: '15 dk önce', warnings: [] }
  },
  {
    id: 2,
    name: 'İstanbul - Beşiktaş',
    address: 'Sinanpaşa Mah. Ortabahçe Cad. No:8',
    google: { status: 'verified', lastSync: '1 saat önce', warnings: [{ type: 'phone_missing', label: 'Telefon Eksik' }] },
    meta: { status: 'unverified', lastSync: '45 dk önce', warnings: [] },
    apple: { status: 'action_required', lastSync: '2 saat önce', warnings: [{ type: 'image_missing', label: 'Görsel Eksik' }] },
    yandex: { status: 'verified', lastSync: '3 saat önce', warnings: [{ type: 'phone_missing', label: 'Telefon Eksik' }] }
  },
  {
    id: 3,
    name: 'Ankara - Çankaya',
    address: 'Kızılay Mah. Atatürk Blv. No:45',
    google: { status: 'action_required', lastSync: '3 saat önce', warnings: [{ type: 'sync_error', label: 'Sync Hatası' }, { type: 'email_missing', label: 'Email Eksik' }, { type: 'image_missing', label: 'Görsel Eksik' }] },
    meta: { status: 'fully_passive', lastSync: null, warnings: [] },
    apple: { status: 'unverified', lastSync: '1 gün önce', warnings: [] },
    yandex: { status: 'verified', lastSync: null, warnings: [] }
  },
  {
    id: 4,
    name: 'İzmir - Alsancak',
    address: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:22',
    google: { status: 'verified', lastSync: '15 dk önce', warnings: [] },
    meta: { status: 'verified', lastSync: '1 gün önce', warnings: [{ type: 'sync_error', label: 'Sync Hatası' }] },
    apple: { status: 'temporarily_passive', lastSync: null, warnings: [] },
    yandex: { status: 'verified', lastSync: '30 dk önce', warnings: [] }
  },
  {
    id: 5,
    name: 'Bursa - Nilüfer',
    address: 'Özlüce Mah. Mudanya Cad. No:100',
    google: { status: 'fully_passive', lastSync: null, warnings: [] },
    meta: { status: 'fully_passive', lastSync: null, warnings: [] },
    apple: { status: 'fully_passive', lastSync: null, warnings: [] },
    yandex: { status: 'verified', lastSync: null, warnings: [] }
  },
  {
    id: 6,
    name: 'Antalya - Muratpaşa',
    address: 'Konyaaltı Cad. No:55',
    google: { status: 'unverified', lastSync: '30 dk önce', warnings: [{ type: 'address_error', label: 'Adres Hatalı' }] },
    meta: { status: 'verified', lastSync: '20 dk önce', warnings: [{ type: 'sync_error', label: 'Sync Hatası' }, { type: 'phone_missing', label: 'Telefon Eksik' }, { type: 'email_missing', label: 'Email Eksik' }, { type: 'image_missing', label: 'Görsel Eksik' }] },
    apple: { status: 'verified', lastSync: '1 saat önce', warnings: [] },
    yandex: { status: 'verified', lastSync: '2 saat önce', warnings: [{ type: 'address_error', label: 'Adres Hatalı' }] }
  }
];

const getWarningIcon = (type: WarningType) => {
  switch (type) {
    case 'phone_missing': return <Phone className="w-3 h-3" />;
    case 'email_missing': return <Mail className="w-3 h-3" />;
    case 'address_error': return <MapPin className="w-3 h-3" />;
    case 'image_missing': return <Image className="w-3 h-3" />;
    case 'sync_error': return <AlertTriangle className="w-3 h-3" />;
  }
};

const getWarningColor = (type: WarningType) => {
  if (type === 'sync_error') return 'bg-red-100 text-red-700 border-red-200';
  return 'bg-yellow-100 text-yellow-700 border-yellow-200';
};

const getStatusConfig = (status: PlatformStatusType) => {
  switch (status) {
    case 'verified':
      return {
        icon: <ShieldCheck className="w-4 h-4" />,
        label: 'Verified',
        color: 'text-green-600'
      };
    case 'unverified':
      return {
        icon: <ShieldAlert className="w-4 h-4" />,
        label: 'Unverified',
        color: 'text-orange-500'
      };
    case 'action_required':
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'Aksiyon Gerekli',
        color: 'text-amber-600'
      };
    case 'fully_passive':
      return {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Tamamen Pasif',
        color: 'text-gray-400'
      };
    case 'temporarily_passive':
      return {
        icon: <PauseCircle className="w-4 h-4" />,
        label: 'Geçici Pasif',
        color: 'text-gray-500'
      };
  }
};

function StatusLegend() {
  const statuses: PlatformStatusType[] = ['verified', 'unverified', 'action_required', 'fully_passive', 'temporarily_passive'];
  
  return (
    <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
      <span className="text-xs font-medium text-gray-500 uppercase">Durumlar:</span>
      {statuses.map((status) => {
        const config = getStatusConfig(status);
        return (
          <div key={status} className={`flex items-center gap-1.5 ${config.color}`}>
            {config.icon}
            <span className="text-xs font-medium">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function LocationStatusTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <StatusLegend />
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left text-xs font-medium text-gray-500 uppercase px-4 py-3">Lokasyon</th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <SiGoogle className="w-3.5 h-3.5" />
                Google
              </div>
            </th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <SiMeta className="w-3.5 h-3.5" />
                Meta
              </div>
            </th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <SiApple className="w-3.5 h-3.5" />
                Apple
              </div>
            </th>
            <th className="text-center text-xs font-medium text-gray-500 uppercase px-4 py-3">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-red-500 font-bold text-sm">Я</span>
                Yandex
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {mockLocations.map((location) => (
            <tr key={location.id} className="hover:bg-blue-50/50 transition-colors">
              <td className="px-4 py-4">
                <p className="text-sm font-medium text-gray-900">{location.name}</p>
                <p className="text-xs text-gray-500">{location.address}</p>
              </td>
              <td className="px-4 py-4">
                <PlatformCell platform={location.google} />
              </td>
              <td className="px-4 py-4">
                <PlatformCell platform={location.meta} />
              </td>
              <td className="px-4 py-4">
                <PlatformCell platform={location.apple} />
              </td>
              <td className="px-4 py-4">
                <PlatformCell platform={location.yandex} showStatusLabel={false} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlatformCell({ platform, showStatusLabel = true }: { platform: PlatformData; showStatusLabel?: boolean }) {
  const statusConfig = getStatusConfig(platform.status);
  const isPassive = platform.status === 'fully_passive' || platform.status === 'temporarily_passive';

  if (isPassive) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className={`flex items-center gap-1.5 ${statusConfig.color}`}>
          {statusConfig.icon}
          <span className="text-xs font-medium">{statusConfig.label}</span>
        </div>
        <span className="text-[10px] text-gray-400">Henüz sync yok</span>
      </div>
    );
  }

  const sortedWarnings = [...platform.warnings].sort((a, b) => {
    if (a.type === 'sync_error') return -1;
    if (b.type === 'sync_error') return 1;
    return 0;
  });

  const visibleWarnings = sortedWarnings.slice(0, 2);
  const hiddenCount = sortedWarnings.length - 2;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        {showStatusLabel && (
          <div className={`flex items-center gap-1 ${statusConfig.color}`}>
            {statusConfig.icon}
            <span className="text-xs font-medium">{statusConfig.label}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{platform.lastSync || 'Bilgi yok'}</span>
        </div>
      </div>

      {sortedWarnings.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {visibleWarnings.map((warning, idx) => (
            <span 
              key={idx}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${getWarningColor(warning.type)}`}
            >
              {getWarningIcon(warning.type)}
              {warning.label}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border bg-gray-100 text-gray-600 border-gray-200">
              +{hiddenCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
