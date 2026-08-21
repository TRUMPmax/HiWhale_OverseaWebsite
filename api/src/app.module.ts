import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./common/prisma/prisma.module";
import { HealthModule } from "./modules/health/health.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProductsModule } from "./modules/products/products.module";
import { SolutionsModule } from "./modules/solutions/solutions.module";
import { CasesModule } from "./modules/cases/cases.module";
import { InquiriesModule } from "./modules/inquiries/inquiries.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ProductsModule,
    SolutionsModule,
    CasesModule,
    InquiriesModule,
  ],
})
export class AppModule {}
