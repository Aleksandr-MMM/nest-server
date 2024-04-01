import { Logger, Injectable } from "@nestjs/common";

/*
Сервис для простого упралением логирования
 */
@Injectable()
export class MyLogger {
  private logger: Logger=new Logger(MyLogger.name);

  /*
  метод отравки логов в консоль
   */
  sendLogMessage(loggerMassage?: string,loggerName?:string) {
    if(loggerName){
      this.logger=new Logger(loggerName)
    }
    this.logger.log(loggerMassage ? loggerMassage : "Модуль запущен");
  }
}