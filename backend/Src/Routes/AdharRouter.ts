import express,{Router } from "express";
import { AdharController } from "../Controller/AdhaarController";
import { AdhaarServices } from "../Services/AdhaarServices";
import upload from "../MiddleWare/Multer";
import { IAdhaarService } from "../Services/IAdharService";

const adharServices=new AdhaarServices()
const adharController = new AdharController(adharServices)
const adhaarRouter:Router=express.Router()
adhaarRouter.post(
    '/parse',
    upload.fields([
      { name: 'frontImage', maxCount: 1 },
      { name: 'backImage', maxCount: 1 }
    ]),
    (req, res) => adharController.parseAdhaar(req, res)
  );
// adhaarRouter.post('/parse',(req,res)=>adharController.parseAdhaar(req,res))

export default adhaarRouter