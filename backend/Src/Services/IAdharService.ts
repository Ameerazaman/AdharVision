import { AddressData } from "../Interface.ts/AddressInterface";

export interface IAdhaarService {
    // preprocessImage(imagePath: string): Promise<string>

    getDataFromAadhar(image: any): Promise<string>;
    getAadharNumber(text: string): Promise<string | null>;
    getName(text: string): string | null;
    getDOB(text: string): string | null;
    getGender(text: string): string | null;
    getAddress(text: string): AddressData | string | undefined
}