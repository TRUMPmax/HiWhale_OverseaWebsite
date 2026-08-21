-- CreateTable
CREATE TABLE "email_codes" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_codes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_codes_email_idx" ON "email_codes"("email");

