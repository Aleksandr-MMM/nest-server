import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { PersistenceService } from "../../index";
import { UsersRepo } from "../../repos/users.repo.";
import { UsersEntity } from "../../entities/users.entity";
import { IdNotFoundException } from "../../../exception/ClientException";
import { FileInterceptor } from "@nestjs/platform-express";
import { validateFilePipes } from "../../../helpers/pipes/ValidateFilePipes";
import { AttachmentResult } from "ravendb";
import { Roles } from "../../../guard/RoleGuard/roles.decorator";
import { Role } from "../../../guard/RoleGuard/role.enum";
import { RolesGuard } from "../../../guard/RoleGuard/roles.guard";

@Controller("/user")
@Roles(Role.User)
@UseGuards(RolesGuard)
export class UsersController {
  readonly currentRepository: UsersRepo;

  constructor(readonly persistence: PersistenceService) {
    this.currentRepository = persistence.getCurrentRepository(UsersEntity, UsersRepo);
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

  @Post("/addPhoto")
  @UseInterceptors(FileInterceptor("photo", { storage: null }))
  async addPhoto(
    @UploadedFile(
      validateFilePipes(/(jpeg)$/, 5)) file: Express.Multer.File,
    @Req() req,
    @Param("id") userId: string
  ): Promise<{ isAttachment: boolean }> {
    return this.currentRepository.addAttachment(req.user.id, file);
  }

  @Get("/photo/:id")
  async getPhoto(
    @Param("id") userId: string
  ): Promise<AttachmentResult | null> {
    return this.currentRepository.getAttachment(userId, "jpeg");
  }
}

