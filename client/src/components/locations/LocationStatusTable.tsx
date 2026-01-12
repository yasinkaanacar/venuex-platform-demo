import { SiGoogle, SiMeta, SiApple } from 'react-icons/si';
import { CheckCircle, XCircle, Clock, AlertTriangle, Phone, Mail, MapPin, Image, ShieldCheck, ShieldAlert, ShieldX, PauseCircle, Calendar } from 'lucide-react';

interface LocationWarning {
  type: 'phone' | 'email' | 'address' | 'image' | 'sync_error';
  label: string;
}

type PlatformStatusType = 'verified' | 'unverified' | 'needs_attention' | 'fully_passive' | 'temp_passive';

interface MainPlatformStatus {
  status: PlatformStatusType;
  lastSync: string;
  warnings: LocationWarning[];
}

interface YandexStatus {
  lastUpdate: string | null;
  warnings: LocationWarning[];
}

interface LocationData {
  id: string;
  name: string;
  address: string;
  google: MainPlatformStatus;
  meta: MainPlatformStatus;
  apple: MainPlatformStatus;
  yandex: YandexStatus;
}

const mockLocations: LocationData[] = [
  {
    id: '1',
    name: 'İstanbul - Kadıköy',
    address: 'Caferağa Mah. Moda Cad. No:12',
    google: { status: 'verified', lastSync: '2 dk önce', warnings: [] },
    meta: { status: 'verified', lastSync: '5 dk önce', warnings: [] },
    apple: { status: 'verified', lastSync: '10 dk önce', warnings: [] },
    yandex: { lastUpdate: '12 Ocak 2026', warnings: [] }
  },
  {
    id: '2',
    name: 'İstanbul - Beşiktaş',
    address: 'Sinanpaşa Mah. Ortabahçe Cad. No:8',
    google: { status: 'verified', lastSync: '1 saat önce', warnings: [{ type: 'phone', label: 'Telefon Eksik' }] },
    meta: { status: 'unverified', lastSync: '45 dk önce', warnings: [] },
    apple: { status: 'needs_attention', lastSync: '2 saat önce', warnings: [{ type: 'image', label: 'Görsel Eksik' }] },
    yandex: { lastUpdate: '10 Ocak 2026', warnings: [{ type: 'phone', label: 'Telefon Eksik' }] }
  },
  {
    id: '3',
    name: 'Ankara - Çankaya',
    address: 'Kızılay Mah. Atatürk Blv. No:45',
    google: { status: 'needs_attention', lastSync: '3 saat önce', warnings: [{ type: 'email', label: 'Email Eksik' }, { type: 'image', label: 'Görsel Eksik' }] },
    meta: { status: 'fully_passive', lastSync: '-', warnings: [] },
    apple: { status: 'unverified', lastSync: '1 gün önce', warnings: [] },
    yandex: { lastUpdate: null, warnings: [] }
  },
  {
    id: '4',
    name: 'İzmir - Alsancak',
    address: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:22',
    google: { status: 'verified', lastSync: '15 dk önce', warnings: [] },
    meta: { status: 'verified', lastSync: '1 gün önce', warnings: [{ type: 'sync_error', label: 'Sync Hatası' }] },
    apple: { status: 'temp_passive', lastSync: '-', warnings: [] },
    yandex: { lastUpdate: '8 Ocak 2026', warnings: [] }
  },
  {
    id: '5',
    name: 'Bursa - Nilüfer',
    address: 'Özlüce Mah. Mudanya Cad. No:100',
    google: { status: 'fully_passive', lastSync: '-', warnings: [] },
    meta: { status: 'fully_passive', lastSync: '-', warnings: [] },
    apple: { status: 'fully_passive', lastSync: '-', warnings: [] },
    yandex: { lastUpdate: null, warnings: [] }
  },
  {
    id: '6',
    name: 'Antalya - Muratpaşa',
    address: 'Konyaaltı Cad. No:55',
    google: { status: 'unverified', lastSync: '30 dk önce', warnings: [{ type: 'address', label: 'Adres Hatalı' }] },
    meta: { status: 'verified', lastSync: '20 dk önce', warnings: [{ type: 'phone', label: 'Telefon Eksik' }, { type: 'email', label: 'Email Eksik' }] },
    apple: { status: 'verified', lastSync: '1 saat önce', warnings: [] },
    yandex: { lastUpdate: '11 Ocak 2026', warnings: [{ type: 'address', label: 'Adres Hatalı' }] }
  }
];

const getWarningIcon = (type: LocationWarning['type']) => {
  switch (type) {
    case 'phone': return <Phone className="w-3 h-3" />;
    case 'email': return <Mail className="w-3 h-3" />;
    case 'address': return <MapPin className="w-3 h-3" />;
    case 'image': return <Image className="w-3 h-3" />;
    case 'sync_error': return <AlertTriangle className="w-3 h-3" />;
  }
};

const getWarningColor = (type: LocationWarning['type']) => {
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
    case 'needs_attention':
      return {
        icon: <AlertTriangle className="w-4 h-4" />,
        label: 'İlgilenilmesi Gerekiyor',
        color: 'text-amber-600'
      };
    case 'fully_passive':
      return {
        icon: <XCircle className="w-4 h-4" />,
        label: 'Tamamen Pasif',
        color: 'text-gray-400'
      };
    case 'temp_passive':
      return {
        icon: <PauseCircle className="w-4 h-4" />,
        label: 'Geçici Pasif',
        color: 'text-gray-500'
      };
  }
};

export default function LocationStatusTable() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
            <tr key={location.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{location.name}</p>
                <p className="text-xs text-gray-500">{location.address}</p>
              </td>
              <td className="px-4 py-3">
                <MainPlatformCell platform={location.google} />
              </td>
              <td className="px-4 py-3">
                <MainPlatformCell platform={location.meta} />
              </td>
              <td className="px-4 py-3">
                <MainPlatformCell platform={location.apple} />
              </td>
              <td className="px-4 py-3">
                <YandexCell yandex={location.yandex} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MainPlatformCell({ platform }: { platform: MainPlatformStatus }) {
  const statusConfig = getStatusConfig(platform.status);
  const isPassive = platform.status === 'fully_passive' || platform.status === 'temp_passive';

  if (isPassive) {
    return (
      <div className="flex flex-col items-center gap-1">
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

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 ${statusConfig.color}`}>
          {statusConfig.icon}
          <span className="text-xs font-medium">{statusConfig.label}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{platform.lastSync}</span>
        </div>
      </div>

      {sortedWarnings.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {sortedWarnings.map((warning, idx) => (
            <span 
              key={idx}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${getWarningColor(warning.type)}`}
            >
              {getWarningIcon(warning.type)}
              {warning.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function YandexCell({ yandex }: { yandex: YandexStatus }) {
  const sortedWarnings = [...yandex.warnings].sort((a, b) => {
    if (a.type === 'sync_error') return -1;
    if (b.type === 'sync_error') return 1;
    return 0;
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-1.5 text-gray-600">
        <Calendar className="w-3.5 h-3.5" />
        <span className="text-xs">{yandex.lastUpdate || 'Bilgi yok'}</span>
      </div>

      {sortedWarnings.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {sortedWarnings.map((warning, idx) => (
            <span 
              key={idx}
              className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${getWarningColor(warning.type)}`}
            >
              {getWarningIcon(warning.type)}
              {warning.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
