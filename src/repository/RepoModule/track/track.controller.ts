import {
  Body,
  Controller, Param,
  Post,
  UploadedFile, UseGuards,
  UseInterceptors, UsePipes
} from "@nestjs/common";
import { PersistenceService, TrackEntity, TrackRepo } from "../../index";
import { FactoryCRUDController } from "../../../BaseFactory.controller";
import { TrackDto } from "../../validate-dto/Track.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { validateFilePipes } from "../../../helpers/pipes/ValidateFilePipes";
import { AbstractValidationPipe } from "../../../helpers/pipes/AbstractValidationPipe";
import { Roles } from "../../../guard/RoleGuard/roles.decorator";
import { Role } from "../../../guard/RoleGuard/role.enum";
import { RolesGuard } from "../../../guard/RoleGuard/roles.guard";
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

  constructor(readonly persistence: PersistenceService) {
    super(persistence);
  }

  @Post()
  @UseInterceptors(FileInterceptor("music", { storage: null }))
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, {
    body: TrackDto
  }))
  async uploadFile(
    @UploadedFile(
      validateFilePipes(/(mpeg)$/, 10)) file: Express.Multer.File,
    @Param("id") trackId: string,
    @Body() body: TrackDto
  ) {
    body=this.currentRepository.checkPropForUndefinedAndSetNull(
      body,'trackName','author')
    // Создание сущности трека в БД
    const createNewTrackProperty = this.currentRepository.storeDocument(body);
    // Добавление вложения в сущность трека
    return this.currentRepository.addAttachment((await createNewTrackProperty).id,file);
  }
}
