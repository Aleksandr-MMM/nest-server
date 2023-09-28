import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { join } from "path";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module(
  {
    imports: [
      MailerModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (config: ConfigService) => (
          {
            transport: {
              host: config.get("mail.host",'smtp.mail.ru'),
              port: config.get("mail.port",465),
              secure: config.get("mail.secure",false),
              auth: {
                user: config.get("mail.user",'test@mail.ru'),
                pass: config.get("mail.pass",'1234')
              }
            },
            defaults: {
              from: `music petProject <${config.get("mail.user",'test@mail.ru')}>`
            },
            template: {
              dir: join(__dirname, "./templates"),
              adapter: new HandlebarsAdapter(),
              options: {
                strict: true
              }
            }
          }),
        inject: [ConfigService]
      }), ConfigModule.forRoot()
    ]
  }
)
export class NestMailerModule {
}