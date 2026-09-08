import { Folder } from "../models/Folder.js";
import { File } from "../models/File.js";

// Create a folder
export const createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Folder name is required",
      });
    }

    const folder = await Folder.create({
      name: name.trim(),
      parentId: parentId || null,
    });

    res.status(201).json(folder);
  } catch (error) {
    console.error("Create folder error:", error);

    res.status(500).json({
      message: "Failed to create folder",
    });
  }
};

// Get folder contents
export const getFolderContents = async (req, res) => {
  try {
    const { id } = req.params;

    const parentId = id === "root" ? null : id;

    const folders = await Folder.find({ parentId })
      .sort({ name: 1 })
      .lean();

    const files = await File.find({ folderId: parentId })
      .sort({ name: 1 })
      .lean();

    // Build breadcrumb path
    const breadcrumbs = [{ _id: null, name: "My Files" }];

    if (parentId) {
      const path = [];
      let currentFolder = await Folder.findById(parentId).lean();

      while (currentFolder) {
        path.unshift({
          _id: currentFolder._id,
          name: currentFolder.name,
        });

        if (!currentFolder.parentId) {
          break;
        }

        currentFolder = await Folder.findById(
          currentFolder.parentId
        ).lean();
      }

      breadcrumbs.push(...path);
    }

    res.json({
      folders,
      files,
      breadcrumbs,
    });
  } catch (error) {
    console.error("Get folder contents error:", error);

    res.status(500).json({
      message: "Failed to load folder contents",
    });
  }
};

// Delete folder
export const deleteFolder = async (req, res) => {
  try {
    const { id } = req.params;

    const folder = await Folder.findById(id);

    if (!folder) {
      return res.status(404).json({
        message: "Folder not found",
      });
    }

    // Prevent deleting a non-empty folder
    const childFolders = await Folder.countDocuments({
      parentId: id,
    });

    const files = await File.countDocuments({
      folderId: id,
    });

    if (childFolders > 0 || files > 0) {
      return res.status(400).json({
        message: "Folder is not empty",
      });
    }

    await Folder.findByIdAndDelete(id);

    res.json({
      message: "Folder deleted successfully",
    });
  } catch (error) {
    console.error("Delete folder error:", error);

    res.status(500).json({
      message: "Failed to delete folder",
    });
  }
};


