import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './Auth.service';
import { UsersModule } from "../repository/RepoModule/users/users.module";
import { jwtConstants } from "./constants";
import { JwtModule } from "@nestjs/jwt";
import { PersistenceModule } from "../repository";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '6000s' },
    }),PersistenceModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
