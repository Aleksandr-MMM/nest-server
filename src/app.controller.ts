import { Body, Controller, Get, Post, Put, UseGuards, UsePipes } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RavendbService } from "./ravendb/ravendb.service";
import { AbstractValidationPipe } from "./helpers/pipes/AbstractValidationPipe";
import { AppDto } from "./repository/validate-dto/App.dto";
import { Roles } from "./guard/RoleGuard/roles.decorator";
import { Role } from "./guard/RoleGuard/role.enum";
import { RolesGuard } from "./guard/RoleGuard/roles.guard";

@Controller('app')
@Roles(Role.Admin)
@UseGuards(RolesGuard)
export class AppController {
  constructor(
    private readonly ravenService: RavendbService,
    private readonly config: ConfigService,
  ) {
  }
  /**
   * Get all entities
   */
  @Get('entities')
  async getEntities(): Promise<string> {
    return 'await this.ravenService.listDocuments();'
  }

  /**
   * Create entities
   */
  @Post('entities')
  async createEntity(@Body() body: object): Promise<object> {
    return await this.ravenService.storeDocument(body);
  }

  /**
   * Add new property in collection
   */
  @Put('addInCollection')
  @UsePipes(new AbstractValidationPipe({ whitelist: true,
    forbidNonWhitelisted: true }, {
    body: AppDto }))
  async updateCollection(@Body() body: AppDto):Promise<string> {
    return await this.ravenService.updateCollection(
      body.databaseName,body.entityName,body.entityValue);
  }

  /**
   * Get Current configSettings
   */
  @Get('config')
  @Roles(Role.Admin)
  getConfig():object {
    const server = this.config.get<string>('server','Not found');
    return { server };
  }
}
