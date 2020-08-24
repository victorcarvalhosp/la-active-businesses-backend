import { BusinessesController } from "../controllers/businesses.controller";
import { Business } from "./../models/Business";

export class Routes {
  public businessesController: BusinessesController = new BusinessesController();

  public routes(app): void {
    app.route("/businesses/import").get((req, res) =>
      this.businessesController
        .importDataFromOpenBusinessAPI()
        .then((completed) => {
          res.json(completed);
          res.end();
        })
        .catch((err: Error) => res.status(500).json(err))
    );

    app.route("/businesses").get((req, res) =>
      this.businessesController
        .list(req.query)
        .then((businesses: Array<Business>) => res.json(businesses))
        .catch((err: Error) => res.status(500).json(err))
    );

    app.route("/businesses").post((req, res) =>
      this.businessesController
        .create(req.body)
        .then((business: Business) => res.status(201).json(business))
        .catch((err: Error) => res.status(500).json(err))
    );

    app.route("/businesses/:id").get((req, res) =>
      this.businessesController
        .show(Number.parseInt(req.params.id))
        .then((business: Business | null) => {
          if (business) {
            res.json(business);
          } else {
            res.status(404).json({ errors: ["Business not found"] });
          }
        })
        .catch((err: Error) => res.status(500).json(err))
    );

    app.route("/businesses/:id").put((req, res) =>
      this.businessesController
        .update(Number.parseInt(req.params.id), res.body)
        .then(() => res.status(202).json({ data: "success" }))
        .catch((err: Error) => res.status(500).json(err))
    );

    app.route("/businesses/:id").delete((req, res) =>
      this.businessesController
        .delete(Number.parseInt(req.params.id))
        .then(() => res.status(204).json({ data: "success" }))
        .catch((err: Error) => res.status(500).json(err))
    );
  }
}
