-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "favoriteTeamId" INTEGER,
    "favoritePlayerId" INTEGER,
    CONSTRAINT "User_favoriteTeamId_fkey" FOREIGN KEY ("favoriteTeamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_favoritePlayerId_fkey" FOREIGN KEY ("favoritePlayerId") REFERENCES "Player" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nbaId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "conference" TEXT NOT NULL,
    "division" TEXT,
    "logoUrl" TEXT,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "winRate" REAL NOT NULL DEFAULT 0.0,
    "rank" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Player" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nbaId" INTEGER NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "height" TEXT,
    "weight" TEXT,
    "country" TEXT,
    "jersey" TEXT,
    "position" TEXT,
    "headshotUrl" TEXT,
    "teamId" INTEGER,
    CONSTRAINT "Player_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerSeasonStat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "season" TEXT NOT NULL,
    "gamesPlayed" INTEGER NOT NULL,
    "pts" REAL NOT NULL,
    "reb" REAL NOT NULL,
    "ast" REAL NOT NULL,
    "stl" REAL NOT NULL,
    "blk" REAL NOT NULL,
    "fgPct" REAL NOT NULL,
    "tppPct" REAL NOT NULL,
    "ftPct" REAL NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlayerSeasonStat_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlayerGameLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "playerId" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    "gameDate" DATETIME NOT NULL,
    "matchup" TEXT NOT NULL,
    "wl" TEXT NOT NULL,
    "pts" INTEGER NOT NULL,
    "reb" INTEGER NOT NULL,
    "ast" INTEGER NOT NULL,
    "stl" INTEGER NOT NULL,
    "blk" INTEGER NOT NULL,
    CONSTRAINT "PlayerGameLog_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Game" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gameId" TEXT NOT NULL,
    "gameDate" DATETIME NOT NULL,
    "gameTime" TEXT,
    "status" TEXT NOT NULL,
    "homeTeamId" INTEGER NOT NULL,
    "homeTeamScore" INTEGER,
    "awayTeamId" INTEGER NOT NULL,
    "awayTeamScore" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Game_homeTeamId_fkey" FOREIGN KEY ("homeTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Game_awayTeamId_fkey" FOREIGN KEY ("awayTeamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Team_nbaId_key" ON "Team"("nbaId");

-- CreateIndex
CREATE UNIQUE INDEX "Player_nbaId_key" ON "Player"("nbaId");

-- CreateIndex
CREATE INDEX "PlayerGameLog_playerId_gameDate_idx" ON "PlayerGameLog"("playerId", "gameDate");

-- CreateIndex
CREATE UNIQUE INDEX "Game_gameId_key" ON "Game"("gameId");

-- CreateIndex
CREATE INDEX "Game_gameDate_idx" ON "Game"("gameDate");
