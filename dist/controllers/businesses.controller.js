"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessesController = void 0;
const date_fns_1 = require("date-fns");
const got_1 = require("got");
const sequelize_1 = require("sequelize");
const env_config_1 = require("../config/env.config");
const Business_1 = require("../models/Business");
const Location_1 = require("../models/Location");
class BusinessesController {
    importDataFromOpenBusinessAPI() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.clearDatabase();
            const bodyCount = yield got_1.default
                .get(`https://data.lacity.org/api/id/6rrh-rzua.json?$query=select+count(0)`, { responseType: "json" })
                .json();
            const totalCount = bodyCount[0].count_0;
            let totalLocations = 0;
            while (totalLocations <= totalCount) {
                const body = yield got_1.default
                    .get(`https://data.lacity.org/resource/6rrh-rzua.json?$$app_token=${env_config_1.API_AUTHORIZATION_TOKEN}&$order=:id&$limit=5000&$offset=${totalLocations}`, { responseType: "json" })
                    .json();
                const locations = [...body];
                const parentBusinessesMap = new Map();
                for (let location of locations) {
                    totalLocations++;
                    const locationStartDate = new Date(location.location_start_date);
                    if (parentBusinessesMap.get(location.business_name)) {
                        yield this.updateBusinessAndInsertNewLocation(parentBusinessesMap, location, locationStartDate);
                    }
                    else {
                        yield this.insertBusinessAndLocationForTheFirstTime(location, locationStartDate, parentBusinessesMap);
                    }
                }
            }
            return { status: "completed" };
        });
    }
    clearDatabase() {
        return Location_1.Location.destroy({
            where: {},
            truncate: true,
            force: true,
            cascade: true,
            restartIdentity: true,
        }).then(() => __awaiter(this, void 0, void 0, function* () {
            yield Business_1.Business.destroy({
                where: {},
                truncate: true,
                cascade: true,
            });
        }));
    }
    updateBusinessAndInsertNewLocation(parentBusinessesMap, location, locationStartDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const actualBusiness = parentBusinessesMap.get(location.business_name);
            const updatedBusiness = Object.assign(Object.assign({}, actualBusiness), { startDate: date_fns_1.isBefore(locationStartDate, actualBusiness.startDate)
                    ? locationStartDate
                    : actualBusiness.startDate, totalLocations: actualBusiness.totalLocations + 1 });
            yield this.update(actualBusiness.id, updatedBusiness);
            yield Location_1.Location.create({
                name: location.business_name,
                businessId: actualBusiness.id,
                city: location.city,
                locationDescription: location.location_description,
                naics: location.naics,
            });
            parentBusinessesMap.set(location.business_name, updatedBusiness);
        });
    }
    insertBusinessAndLocationForTheFirstTime(location, locationStartDate, parentBusinessesMap) {
        return __awaiter(this, void 0, void 0, function* () {
            const business = {
                name: location.business_name,
                startDate: location.location_start_date ? locationStartDate : null,
                totalLocations: 1,
            };
            const businessDb = yield this.create(business);
            yield Location_1.Location.create({
                name: businessDb.name,
                businessId: businessDb.id,
                city: location.city,
                locationDescription: location.location_description,
                naics: location.naics,
            });
            parentBusinessesMap.set(location.business_name, Object.assign({ id: businessDb.id }, business));
            console.log(businessDb.id);
        });
    }
    list(queryParams) {
        let offset = 0;
        if (queryParams && queryParams.offset) {
            offset = Number.parseInt(queryParams.offset);
        }
        let orderBy = "name";
        let order = "ASC";
        if (queryParams && queryParams.orderBy) {
            switch (queryParams.orderBy) {
                case "startDate":
                    orderBy = "startDate";
                    order = "ASC";
                    break;
                case "totalLocations":
                    orderBy = "totalLocations";
                    order = "DESC";
                    break;
                default:
                    orderBy = "name";
                    order = "ASC";
            }
        }
        return Business_1.Business.findAll({
            where: {
                name: {
                    [sequelize_1.Op.like]: queryParams && queryParams.name
                        ? `%${queryParams.name}%`
                        : "%",
                },
            },
            offset: offset,
            limit: 50,
            order: [[orderBy, order]],
        });
    }
    create(business) {
        return Business_1.Business.create(business);
    }
    update(id, business) {
        const update = {
            where: { id: id },
            limit: 1,
        };
        return Business_1.Business.update(business, update);
    }
    show(id) {
        return Business_1.Business.findByPk(id);
    }
    listLocations(businessId) {
        return Location_1.Location.findAll({
            where: {
                businessId: businessId,
            },
            order: [["name", "ASC"]],
        });
    }
    delete(id) {
        const options = {
            where: { id: id },
            limit: 1,
        };
        return Business_1.Business.destroy(options);
    }
}
exports.BusinessesController = BusinessesController;
//# sourceMappingURL=businesses.controller.js.map