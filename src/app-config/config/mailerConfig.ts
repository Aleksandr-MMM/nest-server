import { CreateConfig } from "../utils/CreateConfig";
import { IMailConfig } from "../types/confTypes";
import * as Joi from "joi";
import { registerAs } from "@nestjs/config";

export default registerAs("mail", (): IMailConfig => {

    return (new CreateConfig<IMailConfig>("/mailerConfig.yml",
        Joi.object<IMailConfig, true>({
          host: Joi.string().required(),
          port: Joi.number().required(),
          secure: Joi.boolean().required(),
          user: Joi.string().required(),
          pass: Joi.string().required(),

          }
        )
      ).getConfig
    );
  }
);
