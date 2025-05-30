export interface Game {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  acquisitionYear?: number;
  finishedDate?: Date;
  status: GameStatus;
  isFavorite: boolean;
  userId: number;
  categoryId: number;
  platformId?: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum GameStatus {
  PLAYING = 'Playing',
  DONE = 'Done',
  ABANDONED = 'Abandoned',
}

export interface UpdateGameData {
  title?: string;
  description?: string;
  imageUrl?: string;
  acquisitionDate?: Date;
  finishDate?: Date;
  status?: GameStatus;
  categoryId?: number;
  platformId?: number;
  isFavorite?: boolean;
}

export interface GameResponse {
  id: number;
  title: string;
  description?: string;
  imageUrl?: string;
  acquisitionDate: Date;
  finishDate?: Date;
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
  };
}

export interface GameFilters {
  search?: string;
  categoryId?: number;
  platformId?: number;
  status?: GameStatus;
  isFavorite?: boolean;
}
