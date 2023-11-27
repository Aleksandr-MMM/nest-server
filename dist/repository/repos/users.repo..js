"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersRepo = void 0;
const common_1 = require("@nestjs/common");
const Base_repo_1 = require("./Base.repo");
const ClientException_1 = require("../../exception/ClientException");
let UsersRepo = class UsersRepo extends Base_repo_1.BaseRepo {
    constructor() {
        super(...arguments);
        this.ERROR_FRIEND_EXIST_TEXT = "Friendship already send";
        this.ERROR_EMAIL_USE_TEXT = "Email already in use.";
        this.ERROR_EMAIL_PASS_TEXT = "Incorrect email or password.";
        this.PROPERTY_USER_FRIENDS = "friends";
        this.PROPERTY_USER_SUBSCRIBE = "subscribe";
    }
    removeProtectedInfo(userProfile) {
        if (!userProfile) {
            return null;
        }
        const conv = userProfile;
        delete conv["protected"];
        return conv;
    }
    deleteUserEmail(user) {
        if (!user) {
            return null;
        }
        delete user["email"];
        return user;
    }
    deleteUsersEmailAndProtectedInfo(users) {
        if (!users) {
            return null;
        }
        users.forEach(user => {
            this.removeProtectedInfo(user);
            this.deleteUserEmail(user);
        });
        return users;
    }
    deleteEmailAndProtectedInfo(user) {
        if (!user) {
            return null;
        }
        return this.removeProtectedInfo(this.deleteUserEmail(user));
    }
    async _findUserByEmail(email) {
        return (await this.retrieveDocuments()).find(user => user.email === email);
    }
    async createNewUser(email, password, roles) {
        let result = {};
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
        }
        else {
            throw new ClientException_1.BadReqTypeException(this.ERROR_EMAIL_USE_TEXT);
        }
    }
    async addAlbumForUser(myId, albumId) {
        const [result, session] = await this.openSesAndLoadDocById(myId);
        result.albumList.push(albumId);
        session.dispose();
        return this.metadataRemove(this.removeProtectedInfo(result));
    }
    async findUserByEmailAndPass(email, pass, options) {
        const user = await this._findUserByEmail(email);
        if ((user === null || user === void 0 ? void 0 : user.protected.password) !== pass) {
            throw new ClientException_1.BadReqTypeException(this.ERROR_EMAIL_PASS_TEXT);
        }
        if (options.getRole) {
            return [user.email, user.id, user.protected.roles];
        }
        return [user.email, user.id];
    }
    async findUserByEmail(email) {
        const user = await this._findUserByEmail(email);
        return user === null || user === void 0 ? void 0 : user.email;
    }
    async subscribeUser(myId, userId) {
        var _a, _b, _c;
        const [result, session] = await this.openSesAndLoadDocById(userId);
        if (!!result) {
            if (((_a = result[this.PROPERTY_USER_FRIENDS]) === null || _a === void 0 ? void 0 : _a.find(findId => myId === findId))
                || ((_b = result[this.PROPERTY_USER_SUBSCRIBE]) === null || _b === void 0 ? void 0 : _b.find(findId => myId === findId))) {
                throw new ClientException_1.BadReqTypeException(this.ERROR_FRIEND_EXIST_TEXT);
            }
            else {
                (_c = result[this.PROPERTY_USER_SUBSCRIBE]) === null || _c === void 0 ? void 0 : _c.push(myId);
                await session.saveChanges();
            }
            session.dispose();
            return result.subscribe;
        }
        throw new ClientException_1.BadReqTypeException("incorrect id");
    }
    async unSubscribeUser(myId, userId) {
        const [result, session] = await this.openSesAndLoadDocById(myId);
        result[this.PROPERTY_USER_SUBSCRIBE].splice(result[this.PROPERTY_USER_SUBSCRIBE].findIndex(findId => userId === findId), 1);
        await session.saveChanges();
        session.dispose();
        return result.subscribe;
    }
    async addFriendList(myId, userId) {
        var _a, _b, _c;
        const [myProfile, session] = await this.openSesAndLoadDocById(myId);
        if (!((_a = myProfile[this.PROPERTY_USER_SUBSCRIBE]) === null || _a === void 0 ? void 0 : _a.find(findId => userId === findId)) ||
            ((_b = myProfile[this.PROPERTY_USER_FRIENDS]) === null || _b === void 0 ? void 0 : _b.find(findId => userId === findId))) {
            throw new ClientException_1.BadReqTypeException(this.ERROR_FRIEND_EXIST_TEXT);
        }
        else {
            (_c = myProfile[this.PROPERTY_USER_FRIENDS]) === null || _c === void 0 ? void 0 : _c.push(userId);
            myProfile[this.PROPERTY_USER_SUBSCRIBE].splice(myProfile[this.PROPERTY_USER_SUBSCRIBE].findIndex(findId => userId === findId), 1);
            const myNewFriend = await session.load(userId, {
                documentType: this.descriptor.class
            });
            myNewFriend.friends.push(myId);
            await session.saveChanges();
        }
        session.dispose();
        return myProfile.friends;
    }
    async unFriend(myId, userId) {
        const [myProfile, session] = await this.openSesAndLoadDocById(myId);
        const findIndex = myProfile[this.PROPERTY_USER_FRIENDS].findIndex(findId => userId === findId);
        if (findIndex === -1) {
            throw new ClientException_1.IdNotFoundException();
        }
        else {
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
    async updateProfile(myId, newProperty) {
        let [myProfile, session] = await this.openSesAndLoadDocById(myId);
        Object.assign(myProfile, newProperty);
        await session.saveChanges();
        session.dispose();
        return this.removeProtectedInfo(this.metadataRemove(myProfile));
    }
};
exports.UsersRepo = UsersRepo;
exports.UsersRepo = UsersRepo = __decorate([
    (0, common_1.Injectable)()
], UsersRepo);
//# sourceMappingURL=users.repo..js.map