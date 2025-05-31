export interface Game {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  acquisitionDate: Date;
  finishDate?: Date | null;
  status: GameStatus;
  isFavorite: boolean;
  userId: number;
  categoryId: number;
  platformId?: number | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum GameStatus {
  PLAYING = 'Playing',
  DONE = 'Done',
  ABANDONED = 'Abandoned',
}

export interface CreateGameData {
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  acquisitionDate: string;
  finishDate?: string | null;
  status: GameStatus;
  categoryId: number;
  platformId?: number | null;
  isFavorite?: boolean;
}

export interface UpdateGameData {
  title?: string;
  description?: string | null;
  imageUrl?: string | null;
  acquisitionDate?: string;
  finishDate?: string | null;
  status?: GameStatus;
  categoryId?: number;
  platformId?: number | null;
  isFavorite?: boolean;
}

export interface GameResponse {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  acquisitionDate: Date;
  finishDate?: Date | null;
  status: GameStatus;
  isFavorite: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: number;
    name: string;
  };
  platform?: {
    id: number;
    title: string;
  } | null;
}

export interface GameFilters {
  search?: string;
  categoryId?: number;
  platformId?: number;
  status?: GameStatus;
  isFavorite?: boolean;
}
