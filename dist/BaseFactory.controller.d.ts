import { BaseEntity } from "./repository";
import { BaseRepo } from "./repository/repos/Base.repo";
import { ClassType } from "./helpers/type/ClassType";
export interface IFactoryCRUDController<TPostDTO, TrackPutDTO = TPostDTO> {
    getDocument(): any;
    getDocumentById(id: string): any;
    createDocument(body: TPostDTO, ...anyParams: any): any;
    updateDocument(id: string, body: TrackPutDTO): any;
    deleteById(id: string): any;
}
export interface IOptions {
    DTO?: ClassType<any>;
    addProperty?: object;
}
export interface IOptionsController {
    postOptions?: IOptions;
    putOptions?: IOptions;
}
export declare function FactoryCRUDController<TEntity extends BaseEntity, TRepository extends BaseRepo<TEntity>, TPostDTO extends TEntity, TPutDTO extends TEntity = TPostDTO>(entity: Function, repo: ClassType<TRepository>, options?: IOptionsController): ClassType<IFactoryCRUDController<TPostDTO, TPutDTO>>;
