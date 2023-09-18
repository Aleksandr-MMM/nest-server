import { Module } from "@nestjs/common";
import { AlbumModule } from "./album/album.module";
import { TrackModule } from "./track/track.module";
import { UsersModule } from "./users/users.module";


@Module({
  imports: [AlbumModule,TrackModule,UsersModule],

})
export class AllRepoModules {}