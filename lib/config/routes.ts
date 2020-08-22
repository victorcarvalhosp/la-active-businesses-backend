import { LocationsController } from "../controllers/locations.controller";
import { Request, Response } from "express";
import { BusinessesController } from "../controllers/businesses.controller";

export class Routes {
  public businessesController: BusinessesController = new BusinessesController();
  public locationsController: LocationsController = new LocationsController();

  public routes(app): void {
    app.route("/").get(this.businessesController.index);

    app
      .route("/businesses")
      .get(this.businessesController.index)
      .post(this.businessesController.create);

    app
      .route("/businesses/:id")
      .get(this.businessesController.show)
      .put(this.businessesController.update)
      .delete(this.businessesController.delete);

    app
      .route("/locations")
      .get(this.locationsController.index)
      .post(this.locationsController.create);

    app
      .route("/locations/:id")
      .get(this.locationsController.show)
      .put(this.locationsController.update)
      .delete(this.locationsController.delete);
  }
}
