"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdhaarController_1 = require("../Controller/AdhaarController");
const AdhaarServices_1 = require("../Services/AdhaarServices");
const Multer_1 = __importDefault(require("../MiddleWare/Multer"));
const adharServices = new AdhaarServices_1.AdhaarServices();
const adharController = new AdhaarController_1.AdharController(adharServices);
const adhaarRouter = express_1.default.Router();
adhaarRouter.post('/parse', Multer_1.default.fields([
    { name: 'frontImage', maxCount: 1 },
    { name: 'backImage', maxCount: 1 }
]), (req, res) => adharController.parseAdhaar(req, res));
// adhaarRouter.post('/parse',(req,res)=>adharController.parseAdhaar(req,res))
exports.default = adhaarRouter;
