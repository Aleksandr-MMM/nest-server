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
import { AuthGuard } from "../../../guard/auth.guard";
import { IdNotFoundException } from "../../../exception/ClientException";
import { FileInterceptor } from "@nestjs/platform-express";
import { validateFilePipes } from "../../../helpers/pipes/ValidateFilePipes";
import { AttachmentResult } from "ravendb";

@Controller("/user")
export class UsersController {
  readonly currentRepository: UsersRepo;

  constructor(readonly persistence: PersistenceService) {
    this.currentRepository = persistence.getCurrentRepository(UsersEntity, UsersRepo);
  }

  @Put("/subscribe/:id")
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async unSubscribeUser(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    return this.currentRepository.unSubscribeUser(req.user.id, userId);
  }

  @Put("/addFriend/:id")
  @UseGuards(AuthGuard)
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
  @UseGuards(AuthGuard)
  async unFriend(
    @Req() req,
    @Param("id") userId: string
  ): Promise<string[]> {
    return this.currentRepository.unFriend(req.user.id, userId);
  }

  @Post("/addPhoto")
  @UseGuards(AuthGuard)
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

