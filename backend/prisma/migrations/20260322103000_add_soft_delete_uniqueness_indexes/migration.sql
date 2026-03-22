-- Add soft-delete aware unique indexes to prevent race-condition duplicates
CREATE UNIQUE INDEX "Category_userId_name_isDeleted_key"
ON "Category"("userId", "name", "isDeleted");

CREATE UNIQUE INDEX "Platform_userId_title_isDeleted_key"
ON "Platform"("userId", "title", "isDeleted");

CREATE UNIQUE INDEX "Game_userId_title_isDeleted_key"
ON "Game"("userId", "title", "isDeleted");
