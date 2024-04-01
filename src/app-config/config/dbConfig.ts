import { CreateConfig } from "../utils/CreateConfig";
import { IDbConfig } from "../types/confTypes";
import * as Joi from "joi";
import { registerAs } from "@nestjs/config";

export default registerAs("db", (): IDbConfig => {

    return (new CreateConfig<IDbConfig>("/dbConfig.yml",
        Joi.object<IDbConfig, true>({
            raven: {
              database: Joi.string().required(),
              url: Joi.string().required(),
              certificate: Joi.string(),
              passphrase: Joi.string(),
            }
          }
        )
      ).getConfig
    );
  }
);
