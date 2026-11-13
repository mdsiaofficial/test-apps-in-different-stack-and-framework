import { Module } from '@nestjs/common';
import { DatabaseModule } from './common/db/database.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { StatsModule } from './stats/stats.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    DatabaseModule,
    HealthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    StatsModule,
    SearchModule,
  ],
})
export class AppModule {}