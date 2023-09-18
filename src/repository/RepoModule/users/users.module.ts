import { Module } from '@nestjs/common';
import { UsersRepo } from '../../repos/users.repo.';
import { PersistenceModule } from "../../index";
import { UsersController } from "./users.controller";

@Module({
  imports:[PersistenceModule],
  controllers:[UsersController],
  providers: [UsersRepo],
  exports: [UsersRepo],
})
export class UsersModule {}
