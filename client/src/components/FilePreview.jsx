import {
  X,
  FileText,
  Image as ImageIcon,
  Film,
  File,
  Download,
  ExternalLink,
} from "lucide-react";

import { API_URL } from "../services/api";

const getFileType = (mimeType) => {
  if (mimeType?.startsWith("image/")) return "image";
  if (mimeType?.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "pdf";
  if (mimeType?.startsWith("text/")) return "text";

  return "file";
};

const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";

  const units = ["B", "KB", "MB", "GB"];

  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 1
  )} ${units[index]}`;
};

const FilePreview = ({ file, onClose, onDownload }) => {
  if (!file) return null;

  const type = getFileType(file.mimeType);

  const previewUrl = `${API_URL}/files/${file._id}/preview`;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-8 backdrop-blur-[6px]"
      onMouseDown={handleBackdropClick}
    >
      {/* Quick Look Window */}
      <div
        className="relative flex h-[88vh] w-[88vw] max-w-[1200px] flex-col overflow-hidden rounded-[14px] border border-white/15 bg-[#1e1e1e] shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* =========================
            TOP BAR
        ========================= */}
        <div className="absolute left-0 right-0 top-0 z-20 flex h-14 items-center justify-center bg-gradient-to-b from-black/35 to-transparent">
          <p
            className="max-w-[60%] truncate text-[13px] font-medium text-white/90"
            title={file.name}
          >
            {file.name}
          </p>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-md transition hover:bg-white/20 hover:text-white"
            title="Close"
          >
            <X
              className="h-4 w-4"
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* =========================
            PREVIEW AREA
        ========================= */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#202020] p-10">
          {/* IMAGE */}
          {type === "image" && (
            <img
              src={previewUrl}
              alt={file.name}
              className="max-h-full max-w-full object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.35)]"
            />
          )}

          {/* VIDEO */}
          {type === "video" && (
            <video
              src={previewUrl}
              controls
              autoPlay
              className="object-fit rounded-lg shadow-2xl"
            />
          )}

          {/* PDF */}
          {type === "pdf" && (
            <div className="h-full w-[75%] overflow-hidden rounded-lg bg-white shadow-2xl">
              <iframe
                src={previewUrl}
                title={file.name}
                className="h-full w-full border-0"
              />
            </div>
          )}

          {/* TEXT */}
          {type === "text" && (
            <div className="h-full w-[75%] overflow-hidden rounded-lg bg-white shadow-2xl">
              <iframe
                src={previewUrl}
                title={file.name}
                className="h-full w-full border-0"
              />
            </div>
          )}

          {/* UNKNOWN FILE */}
          {type === "file" && (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-[24px] bg-white/10 backdrop-blur-md">
                <File
                  className="h-16 w-16 text-white/70"
                  strokeWidth={1.1}
                />
              </div>

              <p className="mt-6 text-[15px] font-medium text-white">
                {file.name}
              </p>

              <p className="mt-2 text-[12px] text-white/45">
                Quick Look isn't available for this file
              </p>
            </div>
          )}
        </div>

        {/* =========================
            BOTTOM INFO BAR
        ========================= */}
        <div className="flex h-[58px] shrink-0 items-center justify-between border-t border-white/10 bg-[#252525] px-5">
          {/* Left */}
          <div className="flex min-w-0 items-center gap-3">
            {type === "image" && (
              <ImageIcon
                className="h-4 w-4 text-white/60"
                strokeWidth={1.6}
              />
            )}

            {type === "video" && (
              <Film
                className="h-4 w-4 text-white/60"
                strokeWidth={1.6}
              />
            )}

            {type === "pdf" || type === "text" ? (
              <FileText
                className="h-4 w-4 text-white/60"
                strokeWidth={1.6}
              />
            ) : null}

            {type === "file" && (
              <File
                className="h-4 w-4 text-white/60"
                strokeWidth={1.6}
              />
            )}

            <div className="min-w-0">
              <p
                className="max-w-[400px] truncate text-[12px] text-white/85"
                title={file.name}
              >
                {file.name}
              </p>

              <p className="mt-0.5 text-[10px] text-white/40">
                {file.mimeType || "File"} ·{" "}
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(file)}
              className="flex h-8 items-center gap-2 rounded-md bg-white/10 px-3 text-[11px] text-white/80 transition hover:bg-white/15 hover:text-white"
            >
              <Download
                className="h-3.5 w-3.5"
                strokeWidth={1.7}
              />
              Download
            </button>

            <button
              onClick={() =>
                window.open(previewUrl, "_blank")
              }
              className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-white/70 transition hover:bg-white/15 hover:text-white"
              title="Open"
            >
              <ExternalLink
                className="h-3.5 w-3.5"
                strokeWidth={1.7}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;
