import { LocationInterface } from "../models/Location";
import { Location } from "../models/Location";
import { Request, Response } from "express";
import { UpdateOptions, DestroyOptions } from "sequelize/types";

export class LocationsController {
  public index(req: Request, res: Response) {
    Location.findAll<Location>({})
      .then((locations: Array<Location>) => res.json(locations))
      .catch((err: Error) => res.status(500).json(err));
  }

  public create(req: Request, res: Response) {
    const params: LocationInterface = req.body;

    Location.create<Location>(params)
      .then((location: Location) => res.status(201).json(location))
      .catch((err: Error) => res.status(500).json(err));
  }

  public update(req: Request, res: Response) {
    const locationId: number = Number.parseInt(req.params.id);
    const params: LocationInterface = req.body;

    const update: UpdateOptions = {
      where: { id: locationId },
      limit: 1,
    };

    Location.update(params, update)
      .then(() => res.status(202).json({ data: "success" }))
      .catch((err: Error) => res.status(500).json(err));
  }

  public show(req: Request, res: Response) {
    const locationId: number = Number.parseInt(req.params.id);

    Location.findByPk<Location>(locationId)
      .then((location: Location | null) => {
        if (location) {
          res.json(location);
        } else {
          res.status(404).json({ errors: ["Location not found"] });
        }
      })
      .catch((err: Error) => res.status(500).json(err));
  }

  public delete(req: Request, res: Response) {
    const locationId: number = Number.parseInt(req.params.id);
    const options: DestroyOptions = {
      where: { id: locationId },
      limit: 1,
    };

    Location.destroy(options)
      .then(() => res.status(204).json({ data: "success" }))
      .catch((err: Error) => res.status(500).json(err));
  }
}
