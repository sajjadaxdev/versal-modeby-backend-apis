import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

/*
|--------------------------------------------------------------------------
| Upload Middleware
|--------------------------------------------------------------------------
|
| Usage:
|
| import upload from "../middlewares/upload.js";
|
| router.post(
|     "/",
|     upload("business").single("logo"),
|     createBusiness
| );
|
| router.post(
|     "/",
|     upload("products").array("images", 10),
|     createProduct
| );
|
*/

const imageMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
];
const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".gif",
];


const upload = (folder = "temp") => {

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {

            const destination = path.join(
                process.cwd(),
                "uploads",
                folder
            );

            if (!fs.existsSync(destination)) {
                fs.mkdirSync(destination, {
                    recursive: true,
                });
            }

            cb(null, destination);

        },

        filename: (req, file, cb) => {

            const extension = path.extname(
                file.originalname
            );

            const filename =
                crypto.randomUUID() + extension.toLowerCase();

            cb(null, filename);

        },

    });

    return multer({

        storage,

        limits: {
            fileSize: 5 * 1024 * 1024, // 5 MB
        },

        fileFilter: (req, file, cb) => {

            const extension = path.extname(file.originalname).toLowerCase();
            const validMime = imageMimeTypes.includes(file.mimetype);
            const validExtension = allowedExtensions.includes(extension);

            if (!validMime && !validExtension) {
                console.log("Rejected MIME:", file.mimetype);

                return cb(
                    new Error("Only JPG, PNG, WEBP and GIF images are allowed.")
                );
            }

            cb(null, true);
        },


    });

};

export default upload;