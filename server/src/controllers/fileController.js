
import path from "path";
import fs from "fs";
import { File } from "../models/File.js";
import { Folder } from "../models/Folder.js";

// Upload file
export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const { folderId } = req.body;

    // If folderId is provided, make sure it exists
    if (folderId) {
      const folder = await Folder.findById(folderId);

      if (!folder) {
        fs.unlinkSync(req.file.path);

        return res.status(404).json({
          message: "Folder not found",
        });
      }
    }

    const file = await File.create({
      name: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path,
      folderId: folderId || null,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error("Upload file error:", error);

    // Remove uploaded file if database operation fails
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      message: "Failed to upload file",
    });
  }
};

// Download file
export const downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({
        message: "Physical file not found",
      });
    }

    res.download(
      file.path,
      file.originalName
    );
  } catch (error) {
    console.error("Download file error:", error);

    res.status(500).json({
      message: "Failed to download file",
    });
  }
};

// Rename file
export const renameFile = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "File name is required",
      });
    }

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    file.name = name.trim();

    await file.save();

    res.json(file);
  } catch (error) {
    console.error("Rename file error:", error);

    res.status(500).json({
      message: "Failed to rename file",
    });
  }
};

// Delete file
export const deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete database record
    await File.findByIdAndDelete(req.params.id);

    res.json({
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("Delete file error:", error);

    res.status(500).json({
      message: "Failed to delete file",
    });
  }
};

export const getRecentFiles = async (req, res) => {
  try {
    const files = await File.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(files);
  } catch (error) {
    console.error("Get recent files error:", error);

    res.status(500).json({
      message: "Failed to load recent files",
    });
  }
};

export const previewFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Content-Disposition", "inline");

    res.sendFile(file.path);
  } catch (error) {
    console.error("Preview file error:", error);

    res.status(500).json({
      message: "Failed to preview file",
    });
  }
};

