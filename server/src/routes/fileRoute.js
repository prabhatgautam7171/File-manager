import express from "express";
import upload from "../middleware/upload.js";
import { deleteFile, downloadFile, getRecentFiles, previewFile, renameFile, uploadFile } from "../controllers/fileController.js";


const router = express.Router();

router.post("/upload", upload.single("file"), uploadFile);

router.get("/recent", getRecentFiles);

router.get("/:id/preview", previewFile);

router.get("/:id/download", downloadFile);

router.patch("/:id", renameFile);

router.delete("/:id", deleteFile);

export default router;
