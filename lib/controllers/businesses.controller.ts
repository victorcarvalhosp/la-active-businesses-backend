import { isBefore } from "date-fns";
import { Request, Response } from "express";
import got from "got";
import { DestroyOptions, UpdateOptions } from "sequelize/types";
import { Business } from "../models/Business";
import { Location } from "../models/Location";
import { database } from "./../config/database";
import { API_AUTHORIZATION_TOKEN } from "./../config/env.config";
import { BusinessInterface } from "./../models/Business";
import { Op } from "sequelize";

interface BusinessAPI {
  business_name: string;
  naics: string;
}

export class BusinessesController {
  public async importDataFromOpenBusinessAPI(req: Request, res: Response) {
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

    console.log(totalCount);

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
          parentBusinessesMap.set(location.business_name, updatedBusiness);

          const update: UpdateOptions = {
            where: { id: actualBusiness.id },
            limit: 1,
          };

          await Business.update(updatedBusiness, update);

          await Location.create<Location>({
            name: location.business_name,
            businessId: actualBusiness.id,
          });
        } else {
          const business: BusinessInterface = {
            name: location.business_name,
            startDate: location.location_start_date ? locationStartDate : null,
            totalLocations: 1,
          };
          const businessDb = await Business.create<Business>(business);
          const locationDb = await Location.create<Location>({
            name: businessDb.name,
            businessId: businessDb.id,
          });
          parentBusinessesMap.set(location.business_name, {
            id: businessDb.id,
            ...business,
          });
          console.log(businessDb.id);
        }
      }
    }
    /* Still need to loop into the API to get all records */

    res.json({ status: "completed" });
    res.end();
    // console.log(parentBusinessesMap);
  }

  public index(req: Request, res: Response) {
    let offset: number = 0;
    if (req.query && req.query.offset) {
      offset = Number.parseInt((req.query as any).offset);
    }
    let orderBy = "name";
    let order = "ASC";
    if (req.query && req.query.orderBy) {
      switch ((req.query as any).orderBy) {
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
    Business.findAll<Business>({
      where: {
        name: {
          [Op.like]:
            req.query && req.query.name ? `%${(req.query as any).name}%` : "%",
        },
      },
      offset: offset,
      limit: 50,
      order: [[orderBy, order]],
    })
      .then((businesses: Array<Business>) => res.json(businesses))
      .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: BusinessInterface = req.body;

    Business.create<Business>(params)
      .then((business: Business) => res.status(201).json(business))
      .catch((err: Error) => res.status(500).json(err));
  }

  public update(req: Request, res: Response) {
    const businessId: number = Number.parseInt(req.params.id);
    const params: BusinessInterface = req.body;

    const update: UpdateOptions = {
      where: { id: businessId },
      limit: 1,
    };

    Business.update(params, update)
      .then(() => res.status(202).json({ data: "success" }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public show(req: Request, res: Response) {
    const businessId: number = Number.parseInt(req.params.id);

    Business.findByPk<Business>(businessId)
      .then((business: Business | null) => {
        if (business) {
          res.json(business);
        } else {
          res.status(404).json({ errors: ["Business not found"] });
        }
      })
      .catch((err: Error) => res.status(500).json(err));
  }

  public delete(req: Request, res: Response) {
    const businessId: number = Number.parseInt(req.params.id);
    const options: DestroyOptions = {
      where: { id: businessId },
      limit: 1,
    };

    Business.destroy(options)
      .then(() => res.status(204).json({ data: "success" }))
      .catch((err: Error) => res.status(500).json(err));
  }
}
