export interface Platform {
  id: number;
  title: string;
  company: string | null;
  acquisitionYear: number | null;
  imageUrl: string | null;
  userId: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePlatformData {
  title: string;
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
}

export interface UpdatePlatformData {
  title?: string;
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
}

export interface PlatformResponse {
  id: number;
  title: string;
  company: string | null;
  acquisitionYear: number | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformWithGameCount extends PlatformResponse {
  _count: {
    games: number;
  };
}
