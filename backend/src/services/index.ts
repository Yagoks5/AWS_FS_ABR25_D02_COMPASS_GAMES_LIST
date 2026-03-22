import { AuthService } from './auth.service';
import { CategoryService } from './category.service';
import { DashboardService } from './dashboard.service';
import { GameService } from './game.service';
import { PlatformService } from './platform.service';
import { UserService } from './user.service';

export const authService = new AuthService();
export const categoryService = new CategoryService();
export const dashboardService = new DashboardService();
export const gameService = new GameService();
export const platformService = new PlatformService();
export const userService = new UserService();
