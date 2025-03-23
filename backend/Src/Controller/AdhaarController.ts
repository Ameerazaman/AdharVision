
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AdhaarServices } from '../Services/AdhaarServices';
import { IAdhaarService } from '../Services/IAdharService';
import { AddressData } from '../Interface.ts/AddressInterface';
// import { AdhaarServices } from '../services/AdhaarServices';

export class AdharController {
  constructor(private adharServices: IAdhaarService) { }

  async parseAdhaar(req: Request, res: Response): Promise<void> {
    try {
     
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (!files || !files['frontImage'] || !files['backImage']) {
        res.status(400).json({ error: 'Images are required' });
      }
      // Correct way to access front image
      const frontImage = files?.['frontImage']?.[0];
      const backImage = files?.['backImage']?.[0];

      if (!frontImage || !backImage) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Both Aadhaar front and back images are required!" });
        return;
      }

      const frontpageText = await this.adharServices.getDataFromAadhar(frontImage);
      const backpageText = await this.adharServices.getDataFromAadhar(backImage);

      const aadharNumber: string | null = await this.adharServices.getAadharNumber(frontpageText);

      if (!aadharNumber) {
        res.status(400).json({ status: false, message: "Invalid Aadhar card data!" });
        return;
      }


      const [name, gender, dob, addressData] = await Promise.all([
        this.adharServices.getName(frontpageText),
        this.adharServices.getGender(frontpageText),
        this.adharServices.getDOB(frontpageText),
        this.adharServices.getAddress(backpageText),
      ]);

      if (typeof addressData === "string") {
        res.status(400).json({ status: false, message: addressData });
        return;
      }

      const address=addressData?.address
      const pincode=addressData?.pincode

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

    } catch (error) {
      console.error("Error in Aadhaar Parsing:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
    }
  }
}

