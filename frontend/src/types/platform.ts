export interface Platform {
  id: string;
  title: string;
  owner: string;
  acquisitionYear: string;
  imageUrl: string;
}

export interface PlatformFormData {
  title: string;
  owner: string;
  acquisitionYear: string;
  imageUrl: string;
}