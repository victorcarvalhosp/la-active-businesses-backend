"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const businesses_controller_1 = require("../controllers/businesses.controller");
class Routes {
    constructor() {
        this.businessesController = new businesses_controller_1.BusinessesController();
    }
    routes(app) {
        app.route("/businesses/import").get((req, res) => this.businessesController
            .importDataFromOpenBusinessAPI()
            .then((completed) => {
            res.json(completed);
            res.end();
        })
            .catch((err) => res.status(500).json(err)));
        app.route("/businesses").get((req, res) => this.businessesController
            .list(req.query)
            .then((businesses) => res.json(businesses))
            .catch((err) => res.status(500).json(err)));
        app.route(" ").get((req, res) => this.businessesController
            .listLocations(Number.parseInt(req.params.id))
            .then((locations) => res.json(locations))
            .catch((err) => res.status(500).json(err)));
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map