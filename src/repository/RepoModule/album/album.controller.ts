import { Body, Controller, Delete, Param, Post, Put, Req, UseGuards, UsePipes } from "@nestjs/common";
import { FactoryCRUDController } from "../../../BaseFactory.controller";
import { AlbumEntity } from "../../entities/album.entity";
import { AlbumRepo } from "../../repos/Album.repo";
import { PersistenceService } from "../../index";
import { AlbumPostDto, AlbumPutDto } from "../../validate-dto/Album.dto";
import { AbstractValidationPipe } from "../../../helpers/pipes/AbstractValidationPipe";
import { AuthGuard } from "../../../guard/auth.guard";
import { UsersRepo } from "../../repos/users.repo.";
import { UsersEntity } from "../../entities/users.entity";
import { Roles } from "../../../guard/RoleGuard/roles.decorator";
import { Role } from "../../../guard/RoleGuard/role.enum";
import { RolesGuard } from "../../../guard/RoleGuard/roles.guard";

@Controller("/album")
@Roles(Role.User)
@UseGuards(RolesGuard)
export class AlbumController extends FactoryCRUDController<AlbumEntity,
  AlbumRepo, AlbumPostDto, AlbumPutDto>(AlbumEntity,AlbumRepo) {

  readonly albumRepository: AlbumRepo;
  readonly userRepository: UsersRepo

  readonly addNewAlbumProperty= { trackList: [] }
  constructor(readonly persistence: PersistenceService) {
    super(persistence)
    this.userRepository = persistence.getCurrentRepository(UsersEntity,UsersRepo)
    this.albumRepository = persistence.getCurrentRepository(AlbumEntity,AlbumRepo)
  }
  @Post()
  @UsePipes(new AbstractValidationPipe({ whitelist: true,
    forbidNonWhitelisted: true }, {
    body: AlbumPostDto}))
  async createDocument(@Body() body:AlbumEntity,@Req() req)
  {
    console.log('test1')
    const newAlbum = await this.albumRepository.storeDocument(body,this.addNewAlbumProperty)
    return await this.userRepository.addAlbumForUser(req.user.id,newAlbum.id)
  }
/*
* Push track in trackList
 */
  @Put("/track/:id")
  @UsePipes(new AbstractValidationPipe({ whitelist: true,
    forbidNonWhitelisted: true }, { body: AlbumPutDto }))
  async pushTrackInDocument(
    @Param("id") id: string,
    @Body() body: AlbumEntity): Promise<AlbumEntity> {
    return await this.albumRepository.addTrackInAlbum(body, id)
  }
  /*
* Delete track in trackList
 */
  @Delete("/track/:id")
  @UsePipes(new AbstractValidationPipe({ whitelist: true,
    forbidNonWhitelisted: true }, { body: AlbumPutDto }))
  async delTrackInDocument(
    @Param("id") id: string,
    @Body() body: AlbumEntity): Promise<AlbumEntity> {
    return await this.albumRepository.delTrackInAlbum(body, id)
  }
}
