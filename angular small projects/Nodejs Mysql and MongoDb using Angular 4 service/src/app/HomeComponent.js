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
var forms_1 = require("@angular/forms");
var UserService_1 = require("./UserService");
var http_1 = require("@angular/http");
var HomeComponent = (function () {
    function HomeComponent(userService, builder, http) {
        var _this = this;
        this.userService = userService;
        this.builder = builder;
        this.http = http;
        this.frmsub = this.builder.group({
            name: new forms_1.FormControl(''),
            salary: new forms_1.FormControl('')
        });
        this.userService.getMongoData().subscribe(function (response) { return _this.mongo = response; });
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser().subscribe(function (data) { _this.profile = data; console.log(_this.profile); });
    };
    HomeComponent.prototype.tablesub = function () {
        var _this = this;
        var datas = {
            "ename": this.frmsub.value.name,
            "esalary": this.frmsub.value.salary
        };
        console.log(datas);
        this.userService.Postuser(datas).subscribe(function (data) {
            _this.profilesub = data;
            _this.frmsub.reset();
            console.log(_this.profilesub);
        }, function (err) {
            console.log(err);
        }, function () {
            _this.alert = _this.profilesub.message;
        });
    };
    HomeComponent.prototype.empfull = function (id) {
        var _this = this;
        console.log(id);
        this.userService.Filterlist(id).subscribe(function (data) {
            _this.filterdata = data.data;
            console.log(_this.filterdata);
        }, function (err) {
            console.log(err);
        }, function () {
        });
    };
    return HomeComponent;
}());
HomeComponent = __decorate([
    core_1.Component({
        selector: 'home-page',
        templateUrl: "UI/loops_one.html",
        providers: [UserService_1.UserService]
    }),
    __metadata("design:paramtypes", [UserService_1.UserService, forms_1.FormBuilder, http_1.Http])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=HomeComponent.js.map