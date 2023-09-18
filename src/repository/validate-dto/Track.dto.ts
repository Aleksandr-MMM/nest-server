import { IsOptional, IsString } from "class-validator";
import { TrackEntity } from "../entities";

export class TrackDto extends TrackEntity  {
  @IsOptional()
  @IsString()
  trackName: string | null;
  @IsOptional()
  @IsString()
  author: string | null;
}


