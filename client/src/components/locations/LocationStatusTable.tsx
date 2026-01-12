import { SiGoogle, SiMeta } from 'react-icons/si';
import { CheckCircle, XCircle, Clock, AlertTriangle, Phone, Mail, MapPin, Image } from 'lucide-react';

interface LocationWarning {
  type: 'phone' | 'email' | 'address' | 'image' | 'sync_error';
  label: string;
}

interface PlatformStatus {
  active: boolean;
  lastSync: string;
  warnings: LocationWarning[];
}

interface LocationData {
  id: string;
  name: string;
  address: string;
  google: PlatformStatus;
  meta: PlatformStatus;
}

const mockLocations: LocationData[] = [
  {
    id: '1',
    name: 'İstanbul - Kadıköy',
    address: 'Caferağa Mah. Moda Cad. No:12',
    google: { active: true, lastSync: '2 dk önce', warnings: [] },
    meta: { active: true, lastSync: '5 dk önce', warnings: [] }
  },
  {
    id: '2',
    name: 'İstanbul - Beşiktaş',
    address: 'Sinanpaşa Mah. Ortabahçe Cad. No:8',
    google: { active: true, lastSync: '1 saat önce', warnings: [{ type: 'phone', label: 'Telefon Eksik' }] },
    meta: { active: true, lastSync: '45 dk önce', warnings: [] }
  },
  {
    id: '3',
    name: 'Ankara - Çankaya',
    address: 'Kızılay Mah. Atatürk Blv. No:45',
    google: { active: true, lastSync: '3 saat önce', warnings: [{ type: 'email', label: 'Email Eksik' }, { type: 'image', label: 'Görsel Eksik' }] },
    meta: { active: false, lastSync: '-', warnings: [] }
  },
  {
    id: '4',
    name: 'İzmir - Alsancak',
    address: 'Alsancak Mah. Kıbrıs Şehitleri Cad. No:22',
    google: { active: true, lastSync: '15 dk önce', warnings: [] },
    meta: { active: true, lastSync: '1 gün önce', warnings: [{ type: 'sync_error', label: 'Sync Hatası' }] }
  },
  {
    id: '5',
    name: 'Bursa - Nilüfer',
    address: 'Özlüce Mah. Mudanya Cad. No:100',
    google: { active: false, lastSync: '-', warnings: [] },
    meta: { active: false, lastSync: '-', warnings: [] }
  },
  {
    id: '6',
    name: 'Antalya - Muratpaşa',
    address: 'Konyaaltı Cad. No:55',
    google: { active: true, lastSync: '30 dk önce', warnings: [{ type: 'address', label: 'Adres Hatalı' }] },
    meta: { active: true, lastSync: '20 dk önce', warnings: [{ type: 'phone', label: 'Telefon Eksik' }, { type: 'email', label: 'Email Eksik' }] }
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {mockLocations.map((location) => (
            <tr key={location.id} className="hover:bg-gray-50 transition-colors">
              {/* Location Info */}
              <td className="px-4 py-3">
                <p className="text-sm font-medium text-gray-900">{location.name}</p>
                <p className="text-xs text-gray-500">{location.address}</p>
              </td>

              {/* Google Status */}
              <td className="px-4 py-3">
                <PlatformCell platform={location.google} />
              </td>

              {/* Meta Status */}
              <td className="px-4 py-3">
                <PlatformCell platform={location.meta} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlatformCell({ platform }: { platform: PlatformStatus }) {
  if (!platform.active) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1.5 text-gray-400">
          <XCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Pasif</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Status & Sync */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span className="text-xs font-medium">Aktif</span>
        </div>
        <div className="flex items-center gap-1 text-gray-400">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{platform.lastSync}</span>
        </div>
      </div>

      {/* Warning Bubbles */}
      {platform.warnings.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {platform.warnings.map((warning, idx) => (
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
