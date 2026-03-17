export interface ObstacleReport {
  id: string;
  siteName: string;
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  obstacleType: string; // comma-separated ObstacleType values
  description?: string;
  reportedAt: string;
  verified: boolean;
  reportCount: number;
}

export type ObstacleType =
  | 'entry_denied'
  | 'motorcycle_no_entry'
  | 'freight_elevator_only'
  | 'helmet_removal'
  | 'service_door_only'
  | 'parking_restriction'
  | 'other';

export const OBSTACLE_CONFIG: Record<
  ObstacleType,
  { label: string; description: string; color: string; icon: string }
> = {
  entry_denied: {
    label: 'Kurye girişi yasak',
    description: 'Site, apartman veya iş yerine giriş izni verilmiyor.',
    color: '#ef4444',
    icon: '🚫',
  },
  motorcycle_no_entry: {
    label: 'Motosiklet girişi yasak',
    description: 'Motosikletli kuryelerin site veya binaya girişine izin verilmiyor.',
    color: '#f97316',
    icon: '🏍️',
  },
  freight_elevator_only: {
    label: 'Sadece yük asansörü kullanımı',
    description: 'Normal asansör yasaklanıyor, sadece yük asansörü kullandırılıyor.',
    color: '#f59e0b',
    icon: '🛗',
  },
  helmet_removal: {
    label: 'Kask çıkarma zorunluluğu',
    description: 'Güvenlik gerekçesiyle kask çıkarma dayatılıyor.',
    color: '#a855f7',
    icon: '⛑️',
  },
  service_door_only: {
    label: 'Sadece servis kapısı kullanımı',
    description: 'Ana giriş yerine servis/arka kapıdan giriş zorunlu tutuluyor.',
    color: '#3b82f6',
    icon: '🚪',
  },
  parking_restriction: {
    label: 'Motor/araç park yeri yok',
    description: 'Motorlu kurye araçları için park alanı bulunmuyor.',
    color: '#ec4899',
    icon: '🅿️',
  },
  other: {
    label: 'Diğer',
    description: 'Yukarıdaki kategorilere uymayan başka bir engel.',
    color: '#71717a',
    icon: '❓',
  },
};

export interface FAQ {
  question: string;
  answer: string;
}

export interface DownloadableResource {
  title: string;
  type: 'PDF' | 'DOCX' | 'PNG';
  size: string;
  url: string;
}

export interface CampaignMaterial {
  title: string;
  category: string;
  color: string;
}

export interface ReportFormData {
  siteName: string;
  neighborhood: string;
  street: string;
  buildingNo: string;
  city: string;
  district: string;
  obstacleTypes: ObstacleType[];
  description: string;
  latitude: number | null;
  longitude: number | null;
}
