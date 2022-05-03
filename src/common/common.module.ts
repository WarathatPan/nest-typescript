import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import * as randomString from 'randomstring';
// import * as providers from './providers';

@Global()
@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: +configService.get('HTTP_TIMEOUT'),
        maxRedirects: +configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret:
            configService.get<string>('JWT_SECRET')
            || randomString.generate(100),
          signOptions: { expiresIn: '4h', algorithm: 'HS256' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  // providers: Object.values(providers),
  // exports: Object.values(providers),
})
export default class CommonModule {}
