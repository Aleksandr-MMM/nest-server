import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { PersistenceModule } from "../../index";

@Module({
  imports:[PersistenceModule],
  controllers: [AlbumController],
})
export class AlbumModule {}
