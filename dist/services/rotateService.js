"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotate = void 0;
const dbservice_1 = require("../data/dbservice");
const rotate = (reading, threshold) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = reading;
    doc.id = doc.ts;
    dbservice_1.DbService.save(doc);
    const readings = (yield dbservice_1.DbService.getAll()).map(o => o);
    const ids = readings
        .filter(o => {
        o.ts < new Date().valueOf() - threshold;
    })
        .map(m => m.id);
    dbservice_1.DbService.remove(ids);
});
exports.rotate = rotate;
//# sourceMappingURL=rotateService.js.map