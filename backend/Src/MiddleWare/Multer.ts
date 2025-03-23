import multer, { StorageEngine } from "multer";
import { Request } from "express";
import fs from "fs";

// Ensure the directory exists or create it dynamically
const uploadDirectory = 'uploads/';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory); // Use the ensured directory
    },
    filename: (req: Request, file: Express.Multer.File, cb: any) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

export default upload;