import { Module } from "@nestjs/common";
import { PersistenceModule } from "../../index";
import { TrackController } from "./track.controller";

@Module({
  imports:[PersistenceModule],
  controllers: [TrackController]
})
export class TrackModule {}