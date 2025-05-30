export interface Platform {
  id: number;
  title: string;
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
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
  company?: string;
  acquisitionYear?: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformWithGameCount extends PlatformResponse {
  _count: {
    games: number;
  };
}
