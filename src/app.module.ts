import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule,ReviewsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
