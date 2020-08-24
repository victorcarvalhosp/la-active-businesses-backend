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
  }
}
