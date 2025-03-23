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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdhaarServices = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
// import stringSimilarity from "string-similarity"
class AdhaarServices {
    getDataFromAadhar(image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data: { text } } = yield tesseract_js_1.default.recognize(image.path, "eng");
                console.log("text", text);
                return text.replace(/[^A-Za-z0-9\s]/g, "").trim();
            }
            catch (error) {
                console.error("Error in OCR:", error);
                throw new Error("Aadhaar OCR failed!");
            }
        });
    }
    getAadharNumber(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const idNumberRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
            const match = text.match(idNumberRegex);
            return match ? match[0].replace(/\s/g, "") : null;
        });
    }
    getName(text) {
        // Normalize text: remove special characters & extra spaces
        text = text.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, " ").trim();
        // Split text before DOB or Gender
        const lines = text.split(/\b(Male|Female|\d{2}\/\d{2}\/\d{4}|\d{8})\b/i);
        if (lines.length < 2)
            return null; // No valid section found
        const potentialNameLine = lines[0].trim().split(/\s+/); // Get words before DOB/Gender
        // Remove unwanted words (OCR noise)
        const unwantedWords = ["Indiam", "name", "TEED", "EMER", "BH", "Unique", "Identification", "Authority", "Address", "mdaedd", "EiGousment", "gedd", "oa", "ca"];
        const nameParts = potentialNameLine.filter(word => !unwantedWords.includes(word) && /^[A-Z][a-z]*$|^[A-Z]+$/.test(word) // Allows both "Ameer" and "KK"
        );
        return nameParts.length >= 2 ? nameParts.join(" ") : null;
    }
    // public getName(text: string): string | null {
    //     const nameRegex = /(?:\bA\s|=\s?A\s|Name[:\s-]*)([A-Z][a-z]+\s[A-Z][a-z]+)/m;
    //     const match = text.match(nameRegex);
    //     return match ? match[1].trim() : null;
    // }
    getDOB(text) {
        // Improved regex to capture DOB in different formats
        const dobRegex = /(\d{2})\s*(\/|-)?\s*(\d{2})\s*(\/|-)?\s*(\d{4})/;
        const match = text.match(dobRegex);
        if (match) {
            // Format the extracted DOB correctly as DD/MM/YYYY
            return `${match[1]}/${match[3]}/${match[5]}`;
        }
        return null;
    }
    getGender(text) {
        const genderRegex = /MALE|FEMALE|Male|Female|TRANSGENDER/;
        const match = text.match(genderRegex);
        return match ? match[0] : null;
    }
    getAddress(text) {
        // Remove unwanted special characters but keep useful spaces
        const cleanedText = text.replace(/[^a-zA-Z0-9\s,]/g, "").replace(/\s+/g, " ").trim();
        const addressPattern = /Address\s+([\w\s,]+?)\s+\d{6}/;
        const match = cleanedText.match(addressPattern);
        console.log("Extracted Address:", match ? match[0] : "Not Found");
        if (match) {
            const part1 = match[1]
                .replace(/[^a-zA-Z0-9\s,.'-]/g, "")
                .replace(/\s+/g, " ")
                .trim();
            const split = part1.split(" ");
            const filteredWords = split.filter((word) => word.replace(/[^\w]/g, "").length > 5);
            const code = match[0].match(/\d{6}/);
            if (code) {
                const result = filteredWords.join(", ");
                return { address: `${result}, ${code[0]}`, pincode: code[0] };
            }
        }
        return undefined;
    }
}
exports.AdhaarServices = AdhaarServices;
// Function to Check Aadhaar Card Keywords
//     private checkAadharKeywords(text: string) {
//         const keywords = [
//             "government of india",
//             "unique identification authority",
//             "year of birth",
//             "aadhaar",
//             "male",
//             "female",
//             "transgender",
//             "address"
//         ];
//         return keywords.some((keyword) => text.includes(keyword));
//     }
// }
