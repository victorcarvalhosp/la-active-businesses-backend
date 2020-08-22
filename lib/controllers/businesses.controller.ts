import { BusinessInterface } from "./../models/Business";
import { Business } from "../models/Business";
import { Request, Response } from "express";

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
}
