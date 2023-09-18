"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllRepoModules = void 0;
const common_1 = require("@nestjs/common");
const album_module_1 = require("./album/album.module");
const track_module_1 = require("./track/track.module");
const users_module_1 = require("./users/users.module");
let AllRepoModules = class AllRepoModules {
};
exports.AllRepoModules = AllRepoModules;
exports.AllRepoModules = AllRepoModules = __decorate([
    (0, common_1.Module)({
        imports: [album_module_1.AlbumModule, track_module_1.TrackModule, users_module_1.UsersModule],
    })
], AllRepoModules);
//# sourceMappingURL=AllRepoModules.js.map