import { BaseEntity, PersistenceService } from "./repository";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes } from "@nestjs/common";
import { BaseRepo } from "./repository/repos/Base.repo";
import { AbstractValidationPipe } from "./helpers/pipes/AbstractValidationPipe";
import { ClassType } from "./helpers/type/ClassType";
import { RolesGuard } from "./guard/RoleGuard/roles.guard";
import { Roles } from "./guard/RoleGuard/roles.decorator";
import { Role } from "./guard/RoleGuard/role.enum";


export interface IFactoryCRUDController<TPostDTO, TrackPutDTO = TPostDTO> {
  getDocument(),

  getDocumentById(id: string),

  createDocument(body: TPostDTO, ...anyParams: any),

  updateDocument(id: string, body: TrackPutDTO),

  deleteById(id: string)
}

export interface IOptions {
  DTO?: ClassType<any>;
  addProperty?: object;
}

export interface IOptionsController {
  postOptions?: IOptions,
  putOptions?: IOptions
}

/**
 * Фабрика для создания CRUD контроллера
 */
export function FactoryCRUDController<TEntity extends BaseEntity,
  TRepository extends BaseRepo<TEntity>, TPostDTO extends TEntity, TPutDTO extends TEntity = TPostDTO>(
  entity: Function, repo: ClassType<TRepository>, options?: IOptionsController)
  : ClassType<IFactoryCRUDController<TPostDTO, TPutDTO>> {
  @UseGuards(RolesGuard)
  @Roles(Role.User)
  @Controller()
  class BaseCRUDController implements IFactoryCRUDController<TPostDTO, TPutDTO> {
    public currentRepository: TRepository;

    constructor(readonly persistence: PersistenceService) {
      this.currentRepository = persistence.getCurrentRepository(entity, repo);
    }

    @Get()
    async getDocument(): Promise<TEntity[]> {
      return await this.currentRepository.retrieveDocuments();
    }

    @Get("/exist/:id")
    async isDocumentExists(
      @Param("id") id: string): Promise<{ data: boolean }> {
      return await this.currentRepository.documentExists(id);
    }

    @Get(":id")
    async getDocumentById(
      @Param("id") id: string): Promise<TEntity> {
      return await this.currentRepository.getById(id);
    }

    @Post()
    @UsePipes(new AbstractValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }, {
      body: options?.postOptions?.DTO
    }))
    async createDocument(@Body() body: TPostDTO): Promise<TEntity> {
      return await this.currentRepository.storeDocument(body, options?.postOptions?.addProperty);
    }

    @Put(":id")
    @UsePipes(new AbstractValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    }, { body: options?.putOptions?.DTO }))
    async updateDocument(
      @Param("id") id: string,
      @Body() body: TPutDTO): Promise<TEntity> {
      return await this.currentRepository.updateDocument(body, id);
    }

    @Delete(":id")
    async deleteById(
      @Param("id") id: string): Promise<{id:string}> {
      return await this.currentRepository.deleteById(id);
    }
  }

  return BaseCRUDController;
}