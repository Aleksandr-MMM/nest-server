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
import { IGuardRequest } from "../../../guard/IGuard";
import { AbstractValidationPipe } from "../../../helpers/pipes/AbstractValidationPipe";
import { UsersDto } from "../../validate-dto/Users.dto";

@Controller("/user")
@Roles(Role.User, Role.Admin)
@UseGuards(RolesGuard)
export class UsersController {
  readonly currentRepository: UsersRepo;
  constructor(readonly persistence: PersistenceService) {
    this.currentRepository = persistence.getCurrentRepository(UsersEntity, UsersRepo);
  }
  @Get("/photo/:id")
  async getPhoto(
    @Param("id") userId: string,
    @Res() res: NodeJS.WritableStream
  ): Promise<pipeable.Readable> | never {
    return this.currentRepository.getAttachment(userId, "jpg", res);
  }

  @Get()
  async getUsers() {
    const users=await this.currentRepository.retrieveDocuments()
    return this.currentRepository.deleteUsersEmailAndProtectedInfo(users)
  }

  @Get(":id")
  async getUserById(
    @Param("id") id: string): Promise<UsersEntity> {
    const foundUser=await this.currentRepository.getById(id)
    return this.currentRepository.deleteEmailAndProtectedInfo(foundUser);
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

  @Put("/updateProperty")
  @UsePipes(new AbstractValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }, { body: UsersDto }))
  async putUserProperty(@Body() body: UsersDto, @Req() req: IGuardRequest)
    : Promise<UsersEntity> {
    const updatedUser =await this.currentRepository.updateProfile(req.user.id, body)
    return this.currentRepository.deleteEmailAndProtectedInfo(updatedUser);
  }

  @Delete("/unSubscribe/:id")
  async unSubscribeUser(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    return this.currentRepository.unSubscribeUser(req.user.id, userId);
  }


  @Delete("/unFriend/:id")
  async unFriend(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    return this.currentRepository.unFriend(req.user.id, userId);
  }

  @Post("/addPhoto")
  @UseInterceptors(FileInterceptor("photo", { storage: null }))
  async addPhoto(
    @UploadedFile(
      validateFilePipes(/(jpeg)$/, 5)) file: Express.Multer.File,
    @Req() req: IGuardRequest,
    @Param("id") userId: string
  ): Promise<{ isAttachment: boolean }> {
    return this.currentRepository.addAttachment(req.user.id, file);
  }
}

