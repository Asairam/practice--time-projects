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
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getUser = function () {
        return this.http.get("http://localhost:8080/mysql")
            .map(function (res) {
            var key = '_body';
            return JSON.parse(res[key]);
        });
    };
    UserService.prototype.Postuser = function (datas) {
        return this.http.post('http://localhost:8080/appPost', datas)
            .map(function (res) {
            var key = '_body';
            return JSON.parse(res[key]);
        });
    };
    UserService.prototype.Filterlist = function (id) {
        var uid = {
            "id": id
        };
        return this.http.post('http://localhost:8080/empFilter', uid)
            .map(function (res) {
            var key = '_body';
            return JSON.parse(res[key]);
        });
    };
    UserService.prototype.getMongoData = function () {
        return this.http.get("http://localhost:8080/mongodb").map(function (res1) { return res1.json(); });
    };
    return UserService;
}());
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map