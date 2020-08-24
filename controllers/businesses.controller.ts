import { isBefore } from "date-fns";
import { Request, Response } from "express";
import got from "got";
import { Op } from "sequelize";
import { DestroyOptions, UpdateOptions } from "sequelize/types";
import { API_AUTHORIZATION_TOKEN } from "../config/env.config";
import { Business, BusinessInterface } from "../models/Business";
import { Location } from "../models/Location";

interface BusinessAPI {
  business_name: string;
  naics: string;
}

export class BusinessesController {
  public async importDataFromOpenBusinessAPI() {
    Location.destroy({
      where: {},
      truncate: true,
      force: true,
      cascade: true,
      restartIdentity: true,
    }).then(async () => {
      await Business.destroy({
        where: {},
        truncate: true,
        cascade: true,
      });
    });

    const bodyCount = await got
      .get(
        `https://data.lacity.org/api/id/6rrh-rzua.json?$query=select+count(0)`,
        { responseType: "json" }
      )
      .json();

    const totalCount = bodyCount[0].count_0;

    let totalLocations = 0;
    while (totalLocations <= totalCount) {
      const body: any[] = await got
        .get(
          `https://data.lacity.org/resource/6rrh-rzua.json?$$app_token=${API_AUTHORIZATION_TOKEN}&$order=:id&$limit=5000&$offset=${totalLocations}`,
          { responseType: "json" }
        )
        .json();

      const locations: any[] = [...body];

      const parentBusinessesMap: Map<string, BusinessInterface> = new Map();

      for (let location of locations) {
        totalLocations++;
        const locationStartDate = new Date(location.location_start_date);

        if (parentBusinessesMap.get(location.business_name)) {
          await this.updateBusinessAndInsertNewLocation(
            parentBusinessesMap,
            location,
            locationStartDate
          );
        } else {
          await this.insertBusinessAndLocationForTheFirstTime(
            location,
            locationStartDate,
            parentBusinessesMap
          );
        }
      }
    }
    /* Still need to loop into the API to get all records */
    return { status: "completed" };
    // console.log(parentBusinessesMap);
  }

  private async updateBusinessAndInsertNewLocation(
    parentBusinessesMap: Map<string, BusinessInterface>,
    location: any,
    locationStartDate: Date
  ) {
    const actualBusiness: BusinessInterface = parentBusinessesMap.get(
      location.business_name
    );

    const updatedBusiness: BusinessInterface = {
      ...actualBusiness,
      startDate: isBefore(locationStartDate, actualBusiness.startDate)
        ? locationStartDate
        : actualBusiness.startDate,
      totalLocations: actualBusiness.totalLocations + 1,
    };
    await this.update(actualBusiness.id, updatedBusiness);

    await Location.create<Location>({
      name: location.business_name,
      businessId: actualBusiness.id,
      city: location.city,
      locationDescription: location.location_description,
      naics: location.naics,
    });

    parentBusinessesMap.set(location.business_name, updatedBusiness);
  }

  private async insertBusinessAndLocationForTheFirstTime(
    location: any,
    locationStartDate: Date,
    parentBusinessesMap: Map<string, BusinessInterface>
  ) {
    const business: BusinessInterface = {
      name: location.business_name,
      startDate: location.location_start_date ? locationStartDate : null,
      totalLocations: 1,
    };
    const businessDb = await this.create(business);
    await Location.create<Location>({
      name: businessDb.name,
      businessId: businessDb.id,
      city: location.city,
      locationDescription: location.location_description,
      naics: location.naics,
    });
    parentBusinessesMap.set(location.business_name, {
      id: businessDb.id,
      ...business,
    });
    console.log(businessDb.id);
  }

  public list(queryParams) {
    let offset: number = 0;
    if (queryParams && queryParams.offset) {
      offset = Number.parseInt((queryParams as any).offset);
    }
    let orderBy = "name";
    let order = "ASC";
    if (queryParams && queryParams.orderBy) {
      switch ((queryParams as any).orderBy) {
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
    return Business.findAll<Business>({
      where: {
        name: {
          [Op.like]:
            queryParams && queryParams.name
              ? `%${(queryParams as any).name}%`
              : "%",
        },
      },
      offset: offset,
      limit: 50,
      order: [[orderBy, order]],
    });
  }

  public create(business: BusinessInterface) {
    return Business.create<Business>(business);
  }

  public update(id: number, business: BusinessInterface) {
    const update: UpdateOptions = {
      where: { id: id },
      limit: 1,
    };

    return Business.update(business, update);
  }

  public show(id: number) {
    return Business.findByPk<Business>(id);
  }

  public delete(id: number) {
    const options: DestroyOptions = {
      where: { id: id },
      limit: 1,
    };

    return Business.destroy(options);
  }
}
