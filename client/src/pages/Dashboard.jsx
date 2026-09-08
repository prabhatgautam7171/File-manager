import { useEffect, useState } from "react";
import FilePreview from "../components/FilePreview";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import FolderCard from "../components/FolderCard";
import FileCard from "../components/FileCard";
import CreateFolderModal from "../components/CreateFolderModal";

import {
  getFolderContents,
  getRecentFiles,
  createFolder,
  uploadFile,
  deleteFolder,
  deleteFile,
  downloadFile,
  renameFile,
} from "../services/api";

import { ChevronRight } from "lucide-react";

const Dashboard = () => {
  const [activeItem, setActiveItem] = useState("files");

  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [recentFiles, setRecentFiles] = useState([]);

  const [breadcrumbs, setBreadcrumbs] = useState([
    {
      _id: null,
      name: "My Files",
    },
  ]);

  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  const [currentFolderId, setCurrentFolderId] = useState("root");

  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  // =========================
  // Load folder contents
  // =========================

  const loadFolder = async (folderId = "root") => {
    try {
      setLoading(true);
      setError("");

      const data = await getFolderContents(folderId);

      setFolders(data.folders || []);
      setFiles(data.files || []);
      setBreadcrumbs(data.breadcrumbs || []);

      setCurrentFolderId(folderId);
    } catch (error) {
      console.error("Load folder error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load recent files
  // =========================

  const loadRecentFiles = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getRecentFiles();

      setRecentFiles(data || []);
    } catch (error) {
      console.error("Load recent files error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadFolder("root");
  }, []);

  // =========================
  // Sidebar navigation
  // =========================

  const handleSidebarChange = (item) => {
    setActiveItem(item);
    setSearch("");

    if (item === "recent") {
      loadRecentFiles();
    } else {
      loadFolder(currentFolderId);
    }
  };

  // =========================
  // Folder actions
  // =========================

  const handleOpenFolder = (folder) => {
    setActiveItem("files");
    setSearch("");

    loadFolder(folder._id);
  };

  const handleDeleteFolder = async (folder) => {
    const confirmed = window.confirm(
      `Delete "${folder.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteFolder(folder._id);

      await loadFolder(currentFolderId);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCreateFolder = async (name) => {
    try {
      setCreatingFolder(true);

      await createFolder(
        name,
        currentFolderId === "root"
          ? null
          : currentFolderId
      );

      await loadFolder(currentFolderId);

      return true;
    } catch (error) {
      alert(error.message);

      return false;
    } finally {
      setCreatingFolder(false);
    }
  };

  // =========================
  // File upload
  // =========================

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      await uploadFile(
        file,
        currentFolderId === "root"
          ? null
          : currentFolderId
      );

      if (activeItem === "Recent") {
        await loadRecentFiles();
      } else {
        await loadFolder(currentFolderId);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);

      // Allow selecting the same file again
      event.target.value = "";
    }
  };

  // =========================
  // File actions
  // =========================

  const handleDeleteFile = async (file) => {
    const confirmed = window.confirm(
      `Delete "${file.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteFile(file._id);

      if (activeItem === "Recent") {
        await loadRecentFiles();
      } else {
        await loadFolder(currentFolderId);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRenameFile = async (file) => {
    const newName = window.prompt(
      "Enter new file name:",
      file.name
    );

    if (!newName || newName === file.name) {
      return;
    }

    try {
      await renameFile(file._id, newName);

      if (activeItem === "Recent") {
        await loadRecentFiles();
      } else {
        await loadFolder(currentFolderId);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDownloadFile = (file) => {
    downloadFile(file._id);
  };

  // =========================
  // Search
  // =========================

  const filteredFolders = folders.filter((folder) =>
    folder.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredFiles = files.filter((file) =>
    file.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredRecentFiles = recentFiles.filter((file) =>
    file.name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // =========================
  // Render
  // =========================

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={handleSidebarChange}
      />

      <main className="flex min-w-0 flex-1">
        {/* Explorer content */}
        <div className="min-w-0 flex-1">
          <Header
            search={search}
            setSearch={setSearch}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onUpload={() =>
              document.getElementById("file-upload-input")?.click()
            }
            onCreateFolder={() => setShowCreateFolder(true)}
          />

          <input
            id="file-upload-input"
            type="file"
            className="hidden"
            onChange={handleUpload}
          />

          <section className="px-5 py-4">
            {/* Upload status */}
            {uploading && (
              <div className="mb-3 rounded-md border border-[#e5e5e5] bg-white px-4 py-2.5 text-[13px] text-[#555]">
                Uploading file...
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-3 rounded-md border border-[#f1c4c4] bg-[#fff5f5] px-4 py-2.5 text-[13px] text-[#c42b1c]">
                {error}
              </div>
            )}

            {/* =========================
          RECENT
      ========================= */}
            {activeItem === "recent" ? (
              <div>
                <div className="mb-3 flex items-center gap-1 text-[13px] text-[#555]">
                  <span className="font-medium text-[#222]">Recent</span>
                </div>

                {loading ? (
                  <div className="flex min-h-[250px] items-center justify-center">
                    <p className="text-[13px] text-[#777]">
                      Loading recent files...
                    </p>
                  </div>
                ) : filteredRecentFiles.length === 0 ? (
                  <div className="flex min-h-[250px] items-center justify-center">
                    <div className="text-center">
                      <p className="text-[13px] font-medium text-[#444]">
                        {search ? "No files found" : "No recent files"}
                      </p>

                      <p className="mt-1 text-[12px] text-[#888]">
                        {search
                          ? "Try a different search."
                          : "Upload a file to see it here."}
                      </p>
                    </div>
                  </div>
                ) : viewMode === "list" ? (
                  <div className="overflow-hidden rounded-md border border-[#e5e5e5] bg-white">
                    {/* Column Header */}
                    <div className="grid h-9 grid-cols-[minmax(260px,2fr)_160px_180px_100px_100px] items-center border-b border-[#e5e5e5] bg-[#fafafa] px-3 text-[12px] text-[#666]">
                      <span>Name</span>
                      <span>Date modified</span>
                      <span>Type</span>
                      <span>Size</span>
                      <span></span>
                    </div>

                    {/* Files */}
                    {filteredRecentFiles.map((file) => (
                      <FileCard
                        key={file._id}
                        file={file}
                        onDownload={handleDownloadFile}
                        onRename={handleRenameFile}
                        onDelete={handleDeleteFile}
                        onPreview={setSelectedFile}
                        selected={selectedFile?._id === file._id}
                        viewMode="list"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                    {filteredRecentFiles.map((file) => (
                      <FileCard
                        key={file._id}
                        file={file}
                        onDownload={handleDownloadFile}
                        onRename={handleRenameFile}
                        onDelete={handleDeleteFile}
                        onPreview={setSelectedFile}
                        selected={selectedFile?._id === file._id}
                        viewMode="grid"
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* =========================
              BREADCRUMBS
          ========================= */}
                <div className="mb-3 flex items-center gap-1 text-[13px]">
                  {breadcrumbs.map((crumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                      <div
                        key={crumb._id || "root"}
                        className="flex items-center"
                      >
                        {index > 0 && (
                          <ChevronRight
                            size={14}
                            className="mx-1 text-[#888]"
                          />
                        )}

                        <button
                          onClick={() => {
                            if (isLast) return;

                            const targetId = crumb._id || "root";
                            loadFolder(targetId);
                          }}
                          className={`rounded-md px-1.5 py-1 transition ${isLast
                            ? "font-medium text-[#222]"
                            : "text-[#666] hover:bg-[#e9e9e9] hover:text-[#222]"
                            }`}
                        >
                          {crumb.name}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {loading ? (
                  <div className="flex min-h-[300px] items-center justify-center">
                    <p className="text-[13px] text-[#777]">
                      Loading files...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* =========================
                  LIST VIEW
              ========================= */}
                    {viewMode === "list" ? (
                      <div className="overflow-hidden rounded-md border border-[#e5e5e5] bg-white">
                        {/* Explorer Columns */}
                        <div className="grid h-9 grid-cols-[minmax(260px,2fr)_160px_180px_100px_100px] items-center border-b border-[#e5e5e5] bg-[#fafafa] px-3 text-[12px] text-[#666]">
                          <span>Name</span>
                          <span>Date modified</span>
                          <span>Type</span>
                          <span>Size</span>
                          <span></span>
                        </div>

                        {/* Folders */}
                        {filteredFolders.map((folder) => (
                          <FolderCard
                            key={folder._id}
                            folder={folder}
                            onOpen={handleOpenFolder}
                            onDelete={handleDeleteFolder}
                            viewMode="list"
                          />
                        ))}

                        {/* Files */}
                        {filteredFiles.map((file) => (
                          <FileCard
                            key={file._id}
                            file={file}
                            onDownload={handleDownloadFile}
                            onRename={handleRenameFile}
                            onDelete={handleDeleteFile}
                            onPreview={setSelectedFile}
                            selected={selectedFile?._id === file._id}
                            viewMode="list"
                          />
                        ))}

                        {/* Empty */}
                        {filteredFolders.length === 0 &&
                          filteredFiles.length === 0 && (
                            <div className="flex min-h-[250px] items-center justify-center">
                              <div className="text-center">
                                <p className="text-[13px] font-medium text-[#444]">
                                  {search
                                    ? "No items found"
                                    : "This folder is empty"}
                                </p>

                                <p className="mt-1 text-[12px] text-[#888]">
                                  {search
                                    ? "Try a different search."
                                    : "Create a folder or upload a file to get started."}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      /* =========================
                         GRID VIEW
                      ========================= */
                      <div>
                        {/* Folders */}
                        {filteredFolders.length > 0 && (
                          <div className="mb-6">
                            <div className="mb-2 px-1 text-[12px] font-medium text-[#666]">
                              Folders
                            </div>

                            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                              {filteredFolders.map((folder) => (
                                <FolderCard
                                  key={folder._id}
                                  folder={folder}
                                  onOpen={handleOpenFolder}
                                  onDelete={handleDeleteFolder}
                                  viewMode="grid"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Files */}
                        {filteredFiles.length > 0 && (
                          <div>
                            <div className="mb-2 px-1 text-[12px] font-medium text-[#666]">
                              Files
                            </div>

                            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7">
                              {filteredFiles.map((file) => (
                                <FileCard
                                  key={file._id}
                                  file={file}
                                  onDownload={handleDownloadFile}
                                  onRename={handleRenameFile}
                                  onDelete={handleDeleteFile}
                                  onPreview={setSelectedFile}
                                  selected={selectedFile?._id === file._id}
                                  viewMode="grid"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Empty */}
                        {filteredFolders.length === 0 &&
                          filteredFiles.length === 0 && (
                            <div className="flex min-h-[300px] items-center justify-center">
                              <div className="text-center">
                                <p className="text-[13px] font-medium text-[#444]">
                                  {search
                                    ? "No items found"
                                    : "This folder is empty"}
                                </p>

                                <p className="mt-1 text-[12px] text-[#888]">
                                  {search
                                    ? "Try a different search."
                                    : "Create a folder or upload a file to get started."}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </section>
        </div>

        {/* =========================
      FILE PREVIEW PANE
  ========================= */}
        {/* {selectedFile && (
          <FilePreview
            file={selectedFile}
            onClose={() => setSelectedFile(null)}
            onDownload={handleDownloadFile}
          />
        )} */}
      </main>

      {/* Create Folder Modal */}

      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() =>
          setShowCreateFolder(false)
        }
        onCreate={handleCreateFolder}
        loading={creatingFolder}
      />

      {selectedFile && (
        <FilePreview
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onDownload={handleDownloadFile}
        />
      )}
    </div>
  );
};

export default Dashboard;
