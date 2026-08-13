-- CreateTable
CREATE TABLE "users" (
    "id_user" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email_user" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_user_key" ON "users"("email_user");
