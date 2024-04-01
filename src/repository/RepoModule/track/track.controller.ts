import {
  Body,
  Controller, Get, Param,
  Post, Res,
  UploadedFile, UseGuards,
  UseInterceptors, UsePipes, ValidationPipe
} from "@nestjs/common";
import { PersistenceService, TrackEntity, TrackRepo } from "../../index";
import { FactoryCRUDController } from "../../../BaseFactory.controller";
import { TrackDto } from "../../validate-dto/Track.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { validateFilePipes } from "../../../helpers/pipes/ValidateFilePipes";
import { Roles } from "../../../guard/RoleGuard/roles.decorator";
import { Role } from "../../../guard/RoleGuard/role.enum";
import { RolesGuard } from "../../../guard/RoleGuard/roles.guard";
import { Response } from "express";
import pipeable from "readable-stream";
import { AlbumEntity } from "../../entities/album.entity";
import { AlbumRepo } from "../../repos/Album.repo";
@UseGuards(RolesGuard)
@Roles(Role.User)
@Controller("/track")
export class TrackController extends FactoryCRUDController<TrackEntity, TrackRepo, TrackDto>
(TrackEntity, TrackRepo, {
  postOptions: {
    DTO: TrackDto
  },
  putOptions: {
    DTO: TrackDto
  }
}) {
  readonly currentRepository: TrackRepo;
  readonly albumRepository: AlbumRepo;

  constructor(readonly persistence: PersistenceService,) {
    super(persistence);
    this.albumRepository = persistence.getCurrentRepository(AlbumEntity, AlbumRepo);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor("music", { storage: null }))
  async uploadFile(
    @UploadedFile(validateFilePipes(/(mpeg)$/, 10)) file: Express.Multer.File,
    @Body() body: TrackDto
  ) {
    body=this.currentRepository.checkPropForUndefinedAndSetNull(
      body,'trackName','author')
    // Создание сущности трека в БД
    const createNewTrackProperty = this.currentRepository.storeDocument(body);
    // Добавление вложения в сущность трека
    return this.currentRepository.addAttachment((await createNewTrackProperty).id,file,
      {formatFile:'mp3',contentType:"audio/mp3"});
  }
  @Post('/inAlbum/:id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @UseInterceptors(FileInterceptor("music", { storage: null }))
  async uploadFileAndAddInMyAlbum(
    @UploadedFile(validateFilePipes(/(mpeg)$/, 10)) file: Express.Multer.File,
    @Body() body: TrackDto,
    @Param("id") albumId: string,
  ) {
    const uploadTrackEntity = await this.uploadFile(file, body)
    const trackList:string[] =[]
    trackList.push(uploadTrackEntity.id)
    return await this.albumRepository.addTrackInAlbum(trackList,albumId);
  }
  @Get('/file/:id')
  async getTrackFile(
    @Param("id") trackId: string,
    @Res() res: NodeJS.WritableStream | Response
  ) : Promise<pipeable.Readable | { data: null }> {
    return this.currentRepository.getAttachment(trackId, "mp3", res);
  }
}
