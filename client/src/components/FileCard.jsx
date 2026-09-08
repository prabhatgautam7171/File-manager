
import {
  FileText,
  Image,
  Film,
  File,
  Download,
  Trash2,
  Pencil,
} from "lucide-react";

const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith("image/")) {
    return Image;
  }

  if (mimeType?.startsWith("video/")) {
    return Film;
  }

  if (
    mimeType === "application/pdf" ||
    mimeType?.startsWith("text/")
  ) {
    return FileText;
  }

  return File;
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

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const FileCard = ({
  file,
  onDownload,
  onRename,
  onDelete,
  onPreview,
  selected,
  viewMode = "list",
}) => {
  const Icon = getFileIcon(file.mimeType);

  /*
   * Windows Explorer Details/List View
   */
  if (viewMode === "list") { return (<div onClick={() => onPreview?.(file)} className={`group grid h-10 cursor-pointer grid-cols-[minmax(260px,2fr)_160px_180px_100px_100px] items-center border-b border-[#f0f0f0] px-3 text-[13px] transition ${selected ? "bg-[#e5f1fb]" : "hover:bg-[#f3f3f3]"}`} > {/* Name */} <div className="flex min-w-0 items-center gap-3"> <Icon className="h-[18px] w-[18px] shrink-0 text-[#555]" strokeWidth={1.6} /> <span className="truncate text-[#222]" title={file.name} > {file.name} </span> </div> {/* Date */} <span className="text-[#555]"> {formatDate(file.updatedAt || file.createdAt)} </span> {/* Type */} <span className="truncate pr-4 text-[#555]"> {file.mimeType || "File"} </span> {/* Size */} <span className="text-[#555]"> {formatFileSize(file.size)} </span> {/* Actions */} <div className="flex items-center justify-end gap-0.5 opacity-0 transition group-hover:opacity-100" onClick={(e) => e.stopPropagation()} > <button onClick={() => onDownload(file)} title="Download" className="flex h-7 w-7 items-center justify-center rounded-md text-[#555] hover:bg-[#e5e5e5]" > <Download className="h-3.5 w-3.5" /> </button> <button onClick={() => onRename(file)} title="Rename" className="flex h-7 w-7 items-center justify-center rounded-md text-[#555] hover:bg-[#e5e5e5]" > <Pencil className="h-3.5 w-3.5" /> </button> <button onClick={() => onDelete(file)} title="Delete" className="flex h-7 w-7 items-center justify-center rounded-md text-[#555] hover:bg-[#fde7e7] hover:text-[#c42b1c]" > <Trash2 className="h-3.5 w-3.5" /> </button> </div> </div>); }

  /*
   * Windows-style Icon/Grid View
   */
  return (
    <div onClick={() => onPreview?.(file)} className={`group relative flex min-h-[120px] cursor-pointer flex-col rounded-md border px-3 py-3 transition ${ selected ? "border-[#0078d4] bg-[#e5f1fb]" : "border-transparent hover:border-[#d9d9d9] hover:bg-[#f5f5f5]" }`} >
      {/* Icon */}
      <div className="flex flex-1 items-center justify-center">
        <Icon
          className="h-10 w-10 text-[#555]"
          strokeWidth={1.4}
        />
      </div>

      {/* File name */}
      <div className="mt-2 flex items-center justify-center">
        <p
          className="max-w-full truncate text-center text-[12px] text-[#222]"
          title={file.name}
        >
          {file.name}
        </p>
      </div>

      {/* Hover actions */}
      <div className="absolute right-1.5 top-1.5 flex gap-0.5 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={() => onDownload(file)}
          title="Download"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#555] shadow-sm hover:bg-[#e8e8e8]"
        >
          <Download
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />
        </button>

        <button
          onClick={() => onRename(file)}
          title="Rename"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#555] shadow-sm hover:bg-[#e8e8e8]"
        >
          <Pencil
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />
        </button>

        <button
          onClick={() => onDelete(file)}
          title="Delete"
          className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#555] shadow-sm hover:bg-[#fde7e7] hover:text-[#c42b1c]"
        >
          <Trash2
            className="h-3.5 w-3.5"
            strokeWidth={1.8}
          />
        </button>
      </div>
    </div>
  );
};

export default FileCard;

