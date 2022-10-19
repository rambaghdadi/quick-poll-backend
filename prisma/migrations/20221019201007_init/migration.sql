-- CreateTable
CREATE TABLE "PollQuestion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "question" TEXT NOT NULL,
    "optionLimit" INTEGER,
    "voters" TEXT[],
    "allowNewOptions" BOOLEAN NOT NULL,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PollQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollOption" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vote" INTEGER NOT NULL DEFAULT 0,
    "voters" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "PollOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PollQuestion_id_key" ON "PollQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "PollOption_id_key" ON "PollOption"("id");

-- AddForeignKey
ALTER TABLE "PollOption" ADD CONSTRAINT "PollOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "PollQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
