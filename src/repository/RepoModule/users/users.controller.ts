import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req, Res,
  UploadedFile,
  UseGuards,
  UseInterceptors, UsePipes
} from "@nestjs/common";
import { PersistenceService } from "../../index";
import { UsersRepo } from "../../repos/users.repo.";
import { UsersEntity } from "../../entities/users.entity";
import { IdNotFoundException } from "../../../exception/ClientException";
import { FileInterceptor } from "@nestjs/platform-express";
import { validateFilePipes } from "../../../helpers/pipes/ValidateFilePipes";
import { Roles } from "../../../guard/RoleGuard/roles.decorator";
import { Role } from "../../../guard/RoleGuard/role.enum";
import { RolesGuard } from "../../../guard/RoleGuard/roles.guard";
import pipeable from "readable-stream";
import { AbstractValidationPipe } from "../../../helpers/pipes/AbstractValidationPipe";
import { UsersDto } from "../../validate-dto/Users.dto";
import { Response } from "express";
import { guardRequestType } from "../../../guard/base.guard";

@Controller("/user")
@Roles(Role.User, Role.Admin)
@UseGuards(RolesGuard)
export class UsersController {
  readonly currentRepository: UsersRepo;
  constructor(readonly persistence: PersistenceService) {
    this.currentRepository = persistence.getCurrentRepository(UsersEntity, UsersRepo);
  }



  @Get()
  async getUsers(@Req() req: guardRequestType) {
    const users = await this.currentRepository.retrieveDocuments(10, 0, req.user.id);
    return this.currentRepository.deleteUsersEmailAndProtectedInfo(users);
  }

  @Get(":id")
  async getUserById(
    @Param("id") id: string): Promise<UsersEntity> {
    const foundUser = await this.currentRepository.getById(id);
    return this.currentRepository.deleteEmailAndProtectedInfo(foundUser);
  }

  @Put("/updateProperty")
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, { body: UsersDto }))
  async putUserProperty(@Body() body: UsersDto, @Req() req: guardRequestType)
    : Promise<UsersEntity> {
    const updatedUser = await this.currentRepository.updateProfile(req.user.id, body);
    return this.currentRepository.deleteEmailAndProtectedInfo(updatedUser);
  }
  @Put("/subscribe/:id")
  async subscribeUser(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    if (await this.currentRepository.documentExists(userId)) {
      return this.currentRepository.subscribeUser(req.user.id, userId);
    } else {
      throw new IdNotFoundException();
    }
  }
  @Delete("/unSubscribe/:id")
  async unSubscribeUser(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    return this.currentRepository.unSubscribeUser(req.user.id, userId);
  }
  @Put("/addFriend/:id")
  async addFriend(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    if (await this.currentRepository.documentExists(userId)) {
      return this.currentRepository.addFriendList(req.user.id, userId);
    } else {
      throw new IdNotFoundException();
    }
  }

  @Delete("/unFriend/:id")
  async unFriend(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    return this.currentRepository.unFriend(req.user.id, userId);
  }

  @Get("/photo/:id")
  async getPhoto(
    @Param("id") userId: string,
    @Res() res: NodeJS.WritableStream | Response
  ): Promise<pipeable.Readable | { data: null }> {
    return this.currentRepository.getAttachment(userId, "jpeg", res);
  }
  @Post("/addPhoto")
  @UseInterceptors(FileInterceptor("photo", { storage: null }))
  async addPhoto(
    @UploadedFile(
      validateFilePipes(/(gif|jpe?g|tiff?|png|webp|bmp)$/, 5)) file: Express.Multer.File,
    @Req() req: guardRequestType,
  ): Promise<{ isAttachment: boolean }> {
    return this.currentRepository.addAttachment(req.user.id, file,{formatFile:'jpeg',contentType:"image/jpeg"});
  }
}

