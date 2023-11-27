import { Injectable } from "@nestjs/common";
import { UsersEntity } from "../entities/users.entity";
import { BaseRepo } from "./Base.repo";
import { BadReqTypeException, IdNotFoundException } from "../../exception/ClientException";
import { Role } from "../../guard/RoleGuard/role.enum";

@Injectable()
export class UsersRepo extends BaseRepo<UsersEntity> {

  private readonly ERROR_FRIEND_EXIST_TEXT = "Friendship already send";
  private readonly ERROR_EMAIL_USE_TEXT = "Email already in use.";
  private readonly ERROR_EMAIL_PASS_TEXT = "Incorrect email or password.";
  private readonly PROPERTY_USER_FRIENDS = "friends";
  private readonly PROPERTY_USER_SUBSCRIBE = "subscribe";


  /**
   * Удаляет секретные поля у пользователя
   * @param userProfile профиль пользователя
   */
  protected removeProtectedInfo(userProfile: UsersEntity): UsersEntity {
    if (!userProfile) {
      return null;
    }
    const conv = userProfile;
    delete conv["protected"];
    return conv;
  }

  /**
   * Удаляет Email у пользователя
   * @param user профиль пользователя
   */
  protected deleteUserEmail(user: UsersEntity): UsersEntity {
    if (!user) {
      return null;
    }
    delete user["email"];
    return user;
  }

  /**
   * Удаляет Email у всех пользователей
   * @param users профили пользователей
   */
  public deleteUsersEmailAndProtectedInfo(users: UsersEntity[]): UsersEntity[] {
    if (!users) {
      return null;
    }
    users.forEach(user => {
      this.removeProtectedInfo(user)
      this.deleteUserEmail(user);
    });
    return users;
  }
  /**
   * Удаляет Email и  protected свойства
   * @param user профиль пользователя
   */
  public deleteEmailAndProtectedInfo(user: UsersEntity): UsersEntity {
    if (!user) {
      return null;
    }
    return this.removeProtectedInfo(this.deleteUserEmail(user));
  }

  /**
   * Найти пользователя по email
   * @param email email пользователя
   */
  protected async _findUserByEmail(email: string): Promise<UsersEntity | undefined> {
    return (await this.retrieveDocuments()).find(user => user.email === email);
  }

  /**
   * Создание нового пользователя после прохождения регистрации.
   * @param email мой  зарегестрированный email
   * @param password пароль
   * @param roles массив ролей
   */
  public async createNewUser(email: string, password: string, roles: Role[])
    : Promise<UsersEntity | never> {
    let result = {} as UsersEntity;
    // check dont use email in db
    if ((await this.retrieveDocuments()).find(user => user.email === email) === undefined) {
      result.email = email;
      result.subscribe = [];
      result.friends = [];
      result.status = null;
      result.nickName = "Новый пользователь";
      result.albumList = [];
      result.protected = {
        roles: roles,
        password: password
      };
      result = await this.storeDocument(result);
      return this.removeProtectedInfo(result);
    } else {
      throw new BadReqTypeException(this.ERROR_EMAIL_USE_TEXT);
    }
  }

  /**
   * Создает новый альбом у пользователя.
   * @param myId мой id профиля
   * @param albumId id созданного альбома
   */
  public async addAlbumForUser(myId: string, albumId: string): Promise<UsersEntity> {
    const [result, session] = await this.openSesAndLoadDocById(myId);
    result.albumList.push(albumId);
    session.dispose();
    return this.metadataRemove(this.removeProtectedInfo(result));
  }

  /**
   * Возвращает данные о пользователи для авторизации
   * @param email email для авторизации
   * @param pass пароль для авторизации
   * @param options необязательный параметр getRole.По умолчанию false.
   */
  public async findUserByEmailAndPass(
    email: string, pass: string, options?: { getRole: boolean })
    : Promise<[email: string, id: string] | [email: string, id: string, Role[]]> | never {
    const user = await this._findUserByEmail(email);
    if (user?.protected.password !== pass) {
      throw new BadReqTypeException(this.ERROR_EMAIL_PASS_TEXT);
    }
    if (options.getRole) {
      // Не удалять данные емаил и пароля
      return [user.email, user.id, user.protected.roles];
    }
    // Не удалять данные емаил и пароля
    return [user.email, user.id];
  }

  /**
   * Поиск пользователя в бд по емаил возвращает email в случае успеха. И undefined
   * если не найден результат.
   * @param email email для авторизации
   */
  public async findUserByEmail(email: string): Promise<string | undefined> {
    const user = await this._findUserByEmail(email);
    // Не удалять данные емаил
    return user?.email;
  }

  /**
   * Отправляет заявку на принятие в друзья другому пользователю
   * @param myId мой id профиля
   * @param userId id другого пользователя
   */
  public async subscribeUser(myId: string, userId: string): Promise<string[]> {
    const [result, session] = await this.openSesAndLoadDocById(userId);
    if (!!result) {
      if (result[this.PROPERTY_USER_FRIENDS]?.find(findId => myId === findId)
        || result[this.PROPERTY_USER_SUBSCRIBE]?.find(findId => myId === findId)) {
        throw new BadReqTypeException(this.ERROR_FRIEND_EXIST_TEXT);
      } else {
        result[this.PROPERTY_USER_SUBSCRIBE]?.push(myId);
        await session.saveChanges();
      }
      session.dispose();
      return result.subscribe;
    }
    throw new BadReqTypeException("incorrect id");
  }

  /**
   * Отклоняет заявку на принятия в друзья в своем профиле
   * @param myId мой id профиля
   * @param userId id другого пользователя
   */
  public async unSubscribeUser(myId: string, userId: string): Promise<string[]> {
    const [result, session] = await this.openSesAndLoadDocById(myId);
    result[this.PROPERTY_USER_SUBSCRIBE].splice(
      result[this.PROPERTY_USER_SUBSCRIBE].findIndex(findId => userId === findId), 1);
    await session.saveChanges();
    session.dispose();
    return result.subscribe;
  }

  /**
   * Принимает заявку в друзья в своем и чужом профиле
   * @param myId мой id профиля
   * @param userId id другого пользователя
   */
  public async addFriendList(myId: string, userId: string): Promise<string[]> {
    //  открывает мой профиль
    const [myProfile, session] = await this.openSesAndLoadDocById(myId);
    if (!myProfile[this.PROPERTY_USER_SUBSCRIBE]?.find(findId => userId === findId) ||
      myProfile[this.PROPERTY_USER_FRIENDS]?.find(findId => userId === findId)) {
      throw new BadReqTypeException(this.ERROR_FRIEND_EXIST_TEXT);
    } else {
      myProfile[this.PROPERTY_USER_FRIENDS]?.push(userId);
      myProfile[this.PROPERTY_USER_SUBSCRIBE].splice(
        myProfile[this.PROPERTY_USER_SUBSCRIBE].findIndex(findId => userId === findId), 1);
      //  открыть профиль друга
      const myNewFriend = await session.load(userId, {
        documentType: this.descriptor.class
      });
      myNewFriend.friends.push(myId);
      await session.saveChanges();
    }
    session.dispose();
    return myProfile.friends;
  }

  /**
   * Удаление из списка друзей
   */
  public async unFriend(myId: string, userId: string): Promise<string[]> {
    const [myProfile, session] = await this.openSesAndLoadDocById(myId);
    const findIndex = myProfile[this.PROPERTY_USER_FRIENDS].findIndex(findId => userId === findId);
    if (findIndex === -1) {
      throw new IdNotFoundException();
    } else {
      myProfile[this.PROPERTY_USER_FRIENDS].splice(findIndex, 1);
      const myUnFriend = await session.load(userId, {
        documentType: this.descriptor.class
      });
      const userIndex = myUnFriend[this.PROPERTY_USER_FRIENDS].findIndex(findId => myProfile.id === findId);
      if (userIndex !== -1) {
        myUnFriend[this.PROPERTY_USER_FRIENDS].splice(findIndex, 1);
      }
      await session.saveChanges();
      session.dispose();
    }

    return myProfile.friends;
  }

  public async updateProfile(myId: string, newProperty: UsersEntity): Promise<UsersEntity> {
    let [myProfile, session] = await this.openSesAndLoadDocById(myId);
    Object.assign(myProfile, newProperty);
    await session.saveChanges();
    session.dispose();
    return this.removeProtectedInfo(this.metadataRemove(myProfile));
  }
}