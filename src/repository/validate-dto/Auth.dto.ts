import { IsDefined, IsEmail, IsString, Matches } from "class-validator";

export class UsersDto {
  @IsDefined()
  @IsString()
  @IsEmail()
  public email: string;
  @IsDefined()
  @IsString()
  @Matches(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W))/, {
    message: "Пароль должен состоять как минимум из:латинских символов,строчной ,прописной буквы," +
      "цифры [0-9] и специального символа."
  })
  public password: string;
}

