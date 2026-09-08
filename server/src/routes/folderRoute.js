import express from "express";
import { createFolder, deleteFolder, getFolderContents } from "../controllers/folderController.js";


const router = express.Router();

router.post("/", createFolder);

router.get("/:id", getFolderContents);

router.delete("/:id", deleteFolder);

export default router;
