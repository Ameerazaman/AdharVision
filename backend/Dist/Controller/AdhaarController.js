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
exports.AdharController = void 0;
const http_status_codes_1 = require("http-status-codes");
// import { AdhaarServices } from '../services/AdhaarServices';
class AdharController {
    constructor(adharServices) {
        this.adharServices = adharServices;
    }
    parseAdhaar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const files = req.files;
                if (!files || !files['frontImage'] || !files['backImage']) {
                    res.status(400).json({ error: 'Images are required' });
                }
                // Correct way to access front image
                const frontImage = (_a = files === null || files === void 0 ? void 0 : files['frontImage']) === null || _a === void 0 ? void 0 : _a[0];
                const backImage = (_b = files === null || files === void 0 ? void 0 : files['backImage']) === null || _b === void 0 ? void 0 : _b[0];
                if (!frontImage || !backImage) {
                    res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Both Aadhaar front and back images are required!" });
                    return;
                }
                const frontpageText = yield this.adharServices.getDataFromAadhar(frontImage);
                const backpageText = yield this.adharServices.getDataFromAadhar(backImage);
                const aadharNumber = yield this.adharServices.getAadharNumber(frontpageText);
                if (!aadharNumber) {
                    res.status(400).json({ status: false, message: "Invalid Aadhar card data!" });
                    return;
                }
                const [name, gender, dob, addressData] = yield Promise.all([
                    this.adharServices.getName(frontpageText),
                    this.adharServices.getGender(frontpageText),
                    this.adharServices.getDOB(frontpageText),
                    this.adharServices.getAddress(backpageText),
                ]);
                if (typeof addressData === "string") {
                    res.status(400).json({ status: false, message: addressData });
                    return;
                }
                const address = addressData === null || addressData === void 0 ? void 0 : addressData.address;
                const pincode = addressData === null || addressData === void 0 ? void 0 : addressData.pincode;
                res.status(200).json({
                    status: true,
                    data: {
                        AadharNumber: aadharNumber,
                        Name: name || "Name not found",
                        Gender: gender || "Gender not found",
                        DOB: dob || "DOB not found",
                        Address: address || "Address not found",
                        Pincode: pincode || "Pincode not found",
                    },
                });
            }
            catch (error) {
                console.error("Error in Aadhaar Parsing:", error);
                res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
            }
        });
    }
}
exports.AdharController = AdharController;
