"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumPutDto = exports.AlbumPostDto = void 0;
const class_validator_1 = require("class-validator");
const ClientException_1 = require("../../exception/ClientException");
const album_entity_1 = require("../entities/album.entity");
class AlbumPostDto extends album_entity_1.AlbumEntity {
}
exports.AlbumPostDto = AlbumPostDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AlbumPostDto.prototype, "albumName", void 0);
class AlbumPutDto {
}
exports.AlbumPutDto = AlbumPutDto;
__decorate([
    (0, class_validator_1.IsDefined)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.ArrayMaxSize)(100),
    (0, class_validator_1.ArrayUnique)((el) => {
        if (typeof el === 'string' || el instanceof String) {
            return el;
        }
        else {
            throw new ClientException_1.UnsupportedTypeException();
        }
    }),
    __metadata("design:type", Array)
], AlbumPutDto.prototype, "trackList", void 0);
//# sourceMappingURL=Album.dto.js.map