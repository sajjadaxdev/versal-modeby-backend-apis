import fs from "fs";
import path from "path";

/*
|--------------------------------------------------------------------------
| Get Upload Path
|--------------------------------------------------------------------------
*/

export const getBaseUrl = () => {
    return `${process.env.APP_URL}${process.env.APP_UPLOAD}`;
}

export const getUploadPath = (filePath) => {

    if (!filePath) return null;

    return path.join(
        process.cwd(),
        "uploads",
        filePath
    );

};

/*
|--------------------------------------------------------------------------
| Check File Exists
|--------------------------------------------------------------------------
*/

export const fileExists = (folder, filename) => {

    if (!filename) return false;

    return fs.existsSync(
        getUploadPath(folder, filename)
    );

};

/*
|--------------------------------------------------------------------------
| Delete File
|--------------------------------------------------------------------------
*/

export const deleteFile = (filePath) => {

    if (!filePath) return;

    const absolutePath = getUploadPath(filePath);

    if (fs.existsSync(absolutePath)) {

        fs.unlinkSync(absolutePath);

    }

};

/*
|--------------------------------------------------------------------------
| Replace File
|--------------------------------------------------------------------------
|
| Delete old file if new one uploaded.
|
*/

export const replaceFile = (
    folder,
    oldFile,
    newFile
) => {

    if (!newFile) {

        return oldFile;

    }

    if (oldFile) {

        deleteFile(oldFile);

    }

    return `${folder}/${newFile}`;

};

/*
|--------------------------------------------------------------------------
| Get Public URL
|--------------------------------------------------------------------------
*/

export const getFileUrl = (
    req,
    folder,
    filename
) => {

    if (!filename) return null;

    return `${req.protocol}://${req.get("host")}/uploads/${folder}/${filename}`;

};

export const deleteUploadedFile = (file) => {

    if (!file) return;

    if (fs.existsSync(file.path))
        fs.unlink(file.path, () => {});

};