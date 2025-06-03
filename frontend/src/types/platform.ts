export interface Platform {
  id: number;
  title: string;
  company: string;
  acquisitionYear: number;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformFormData {
  title: string;
  company: string;
  acquisitionYear: number;
  imageUrl?: string;
}