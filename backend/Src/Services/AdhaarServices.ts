import Tesseract from "tesseract.js";
import { IAdhaarService } from "./IAdharService";
import { AddressData } from "../Interface.ts/AddressInterface";
import sharp from "sharp";
import path from "path";
import fs from 'fs'
// import stringSimilarity from "string-similarity"
export class AdhaarServices implements IAdhaarService {

    public async getDataFromAadhar(image: any): Promise<string> {

        try {
            const { data: { text } } = await Tesseract.recognize(image.path, "eng")
            console.log("text", text)
            return text.replace(/[^A-Za-z0-9\s]/g, "").trim();
        } catch (error) {
            console.error("Error in OCR:", error);
            throw new Error("Aadhaar OCR failed!");
        }
    }

    public async getAadharNumber(text: string): Promise<string | null> {
        const idNumberRegex = /\b\d{4}\s\d{4}\s\d{4}\b/;
        const match = text.match(idNumberRegex);
        return match ? match[0].replace(/\s/g, "") : null;
    }

      public getName(text: string): string | null {
        // Normalize text: remove special characters & extra spaces
        text = text.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, " ").trim();

        // Split text before DOB or Gender
        const lines = text.split(/\b(Male|Female|\d{2}\/\d{2}\/\d{4}|\d{8})\b/i);

        if (lines.length < 2) return null; // No valid section found

        const potentialNameLine = lines[0].trim().split(/\s+/); // Get words before DOB/Gender

        // Remove unwanted words (OCR noise)
        const unwantedWords = ["Indiam", "name","TEED", "EMER", "BH", "Unique", "Identification", "Authority", "Address", "mdaedd", "EiGousment", "gedd", "oa", "ca"];

        const nameParts = potentialNameLine.filter(
            word => !unwantedWords.includes(word) && /^[A-Z][a-z]*$|^[A-Z]+$/.test(word) // Allows both "Ameer" and "KK"
        );

        return nameParts.length >= 2 ? nameParts.join(" ") : null;
    }
    // public getName(text: string): string | null {
    //     const nameRegex = /(?:\bA\s|=\s?A\s|Name[:\s-]*)([A-Z][a-z]+\s[A-Z][a-z]+)/m;
    //     const match = text.match(nameRegex);
    //     return match ? match[1].trim() : null;
    // }


    public getDOB(text: string): string | null {
        // Improved regex to capture DOB in different formats
        const dobRegex = /(\d{2})\s*(\/|-)?\s*(\d{2})\s*(\/|-)?\s*(\d{4})/;

        const match = text.match(dobRegex);

        if (match) {
            // Format the extracted DOB correctly as DD/MM/YYYY
            return `${match[1]}/${match[3]}/${match[5]}`;
        }

        return null;
    }



    public getGender(text: string): string | null {
        const genderRegex = /MALE|FEMALE|Male|Female|TRANSGENDER/;
        const match = text.match(genderRegex);
        return match ? match[0] : null;
    }

    public getAddress(text: string): AddressData | string | undefined {
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

    // async parseAdhar(frontImage: any, backImage: any) {
    //     try {
    //         const frontImagePath = frontImage.path;
    //         const backImagePath = backImage.path;

    //         // Extract text from both images
    //         const frontText = await Tesseract.recognize(frontImagePath, 'eng');
    //         const backText = await Tesseract.recognize(backImagePath, 'eng');

    //         const frontTextData = frontText.data.text.toLowerCase();
    //         const backTextData = backText.data.text.toLowerCase();

    //         // Check Aadhaar Card Keywords
    //         const isFrontAadhar = this.checkAadharKeywords(frontTextData);
    //         const isBackAadhar = this.checkAadharKeywords(backTextData);

    //         if (!isFrontAadhar || !isBackAadhar) {
    //             console.log("Both images should be Aadhaar cards");
    //             return { message: "Both images should be Aadhaar cards" };
    //         }
    //         console.log(frontTextData, "frontTextData")
    //         // Extract Aadhaar Details
    //         const adhaarNumber = frontText.data.text.match(/\d{4} \d{4} \d{4}/)?.[0];

    //         // Extract Name (handling "BH", "EMER", or any distorted pattern)
    //         const name = frontText.match(/(?:bh|emer|5\/0|s\/o)?\s*[~:.]*\s*([a-zA-Z\s]+)/i)?.[1];

    //         // Extract DOB
    //         const dob = frontTextData.match(/\s+(\d{2}\/\d{2}\/\d{4})/)?.[1];
    //         const gender = frontTextData.match(/(male|female|transgender)/i)?.[0];
    //         // Extract Address (Handling "Address" as "pron]")
    //         const address = backTextData.match(/(?:address|pron])\s*[:~-]?\s*([\s\S]*?)kerala/i)?.[1]?.trim();

    //         console.log(adhaarNumber, "adhaarNumber");
    //         console.log(name, "name");
    //         console.log(dob, "dob");
    //         console.log(gender, "gender");
    //         console.log(address, "address");

    //         return {
    //             adhaarNumber,
    //             name: name?.trim(),
    //             dob,
    //             address: address?.trim(),
    //         };

    //     } catch (error) {
    //         console.error("Error Parsing Aadhaar:", error);
    //         return null;
    //     }
}



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
