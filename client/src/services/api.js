export const API_URL = "https://file-manager-backend-li0e.onrender.com/api";

export const getFolderContents = async (folderId = "root") => {
  const response = await fetch(`${API_URL}/folders/${folderId}`);

  if (!response.ok) {
    throw new Error("Failed to load folder contents");
  }

  return response.json();
};

export const createFolder = async (name, parentId = null) => {
  const response = await fetch(`${API_URL}/folders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      parentId,
    }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to create folder");
  }

  return response.json();
};

export const uploadFile = async (file, folderId = null) => {
  const formData = new FormData();

  formData.append("file", file);

  if (folderId) {
    formData.append("folderId", folderId);
  }

  const response = await fetch(`${API_URL}/files/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to upload file");
  }

  return response.json();
};

export const downloadFile = (fileId) => {
  window.open(`${API_URL}/files/${fileId}/download`, "_blank");
};

export const renameFile = async (fileId, name) => {
  const response = await fetch(`${API_URL}/files/${fileId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to rename file");
  }

  return response.json();
};

export const deleteFile = async (fileId) => {
  const response = await fetch(`${API_URL}/files/${fileId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete file");
  }

  return response.json();
};

export const deleteFolder = async (folderId) => {
  const response = await fetch(`${API_URL}/folders/${folderId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to delete folder");
  }

  return response.json();
};

export const getRecentFiles = async () => {
  const response = await fetch(`${API_URL}/files/recent`);

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to load recent files");
  }

  return response.json();
};
