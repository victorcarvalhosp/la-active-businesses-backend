import { BusinessInterface } from "./../models/Business";
import { Business } from "../models/Business";
import { Request, Response } from "express";
import { UpdateOptions, DestroyOptions } from "sequelize/types";

export class BusinessesController {
  public index(req: Request, res: Response) {
    Business.findAll<Business>({})
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
