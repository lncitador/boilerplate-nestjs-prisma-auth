import { Global, Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { AuthModule } from './domains/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './domains/user/user.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    NestjsFormDataModule,
    PrismaModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
  exports: [HttpModule],
})
export class AppModule {}
