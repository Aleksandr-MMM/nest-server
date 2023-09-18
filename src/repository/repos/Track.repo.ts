import { BaseRepo } from "./Base.repo";
import { TrackEntity } from "../entities";
import { AttachmentsTypeException, BadReqTypeException } from "../../exception/ClientException";

export class TrackRepo extends BaseRepo<TrackEntity> {

  private ERRORMESSAGE='Incorrect request.Please send correct id'

  public async addFile(file: Express.Multer.File, paramsId: string): Promise<any> {
    const session = this.documentStore.openSession();
    const isFindTrack=await this.documentExists(paramsId)

    //  Проверка на наличие созданного документа
    if(isFindTrack.data){
      const checkAttachments = await session.advanced.attachments.exists(paramsId, paramsId);
      //  Проверка наличие вложения у документа
      if (!checkAttachments) {
        await session.advanced.attachments.store(paramsId, paramsId, file.buffer);
      } else {
        throw new AttachmentsTypeException();
      }
    }
    else {
      throw new BadReqTypeException(this.ERRORMESSAGE)
    }
    await session.saveChanges();
    session.dispose();
    return 200;
  }

}
