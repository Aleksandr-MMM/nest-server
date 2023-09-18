import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module(
  {
    imports: [MailerModule.forRoot({
      transport: {
        host: "smtp.mail.ru",
        port: 465,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: "virus_2010-2009@mail.ru",
          pass: "HKNLwAsXvzbWpXX80gUS"
        }
      },
      defaults: {
        from: "\"music petProject\" <virus_2010-2009@mail.ru>"
      },
      template: {
        dir: __dirname + "/templates",
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
    ]
  }
)
export class NestMailerModule {
}