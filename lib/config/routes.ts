import { Request, Response } from "express";
import { BusinessesController } from "../controllers/businesses.controller";

export class Routes {
  public businessesController: BusinessesController = new BusinessesController();

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
  }
}
