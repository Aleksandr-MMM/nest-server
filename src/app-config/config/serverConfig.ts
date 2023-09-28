import { CreateConfig } from "../utils/CreateConfig";
import { IAppConfig } from "../types/confTypes";
import * as Joi from "joi";
import { registerAs } from "@nestjs/config";

export default registerAs("server", (): IAppConfig => {

    return (new CreateConfig<IAppConfig>("/serverConfig.yml",
        Joi.object<IAppConfig, true>({
            environment: Joi.string().required().valid("development", "production"),
            names: Joi.array<string[]>().required()
          }
        )
      ).getConfig
    );
  }
);
