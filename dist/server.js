"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// lib/server.ts
const app_1 = require("./app");
const PORT = process.env.PORT || 3000;
app_1.default.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
//# sourceMappingURL=server.js.map