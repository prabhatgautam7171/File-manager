
import {
  Folder,
  Trash2,
} from "lucide-react";

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const FolderCard = ({
  folder,
  onOpen,
  onDelete,
  viewMode = "list",
}) => {
  /*
   * Windows Explorer Details/List View
   */
  if (viewMode === "list") {
    return (
      <div
        className="group grid h-10 grid-cols-[minmax(260px,2fr)_160px_180px_100px_auto] items-center border-b border-[#f0f0f0] px-3 text-[13px] transition hover:bg-[#f3f3f3]"
        onDoubleClick={() => onOpen(folder)}
      >
        {/* Name */}
        <div className="flex min-w-0 items-center gap-3">
          <Folder
            className="h-[18px] w-[18px] shrink-0 text-[#e8a317]"
            fill="#f6c453"
            strokeWidth={1.3}
          />

          <span
            className="truncate text-[#222]"
            title={folder.name}
          >
            {folder.name}
          </span>
        </div>

        {/* Date */}
        <span className="text-[#555]">
          {formatDate(folder.updatedAt || folder.createdAt)}
        </span>

        {/* Type */}
        <span className="text-[#555]">
          File folder
        </span>

        {/* Size */}
        <span className="text-[#555]">
          —
        </span>

        {/* Actions */}
        <div className="flex items-center justify-end opacity-0 transition group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(folder);
            }}
            title="Delete"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#555] hover:bg-[#fde7e7] hover:text-[#c42b1c]"
          >
            <Trash2
              className="h-3.5 w-3.5"
              strokeWidth={1.8}
            />
          </button>
        </div>
      </div>
    );
  }

  /*
   * Windows-style Icon/Grid View
   */
  return (
    <div
      className="group relative flex min-h-[120px] cursor-default flex-col rounded-md border border-transparent px-3 py-3 transition hover:border-[#d9d9d9] hover:bg-[#f5f5f5]"
      onDoubleClick={() => onOpen(folder)}
    >
      {/* Folder Icon */}
      <div className="flex flex-1 items-center justify-center">
        <Folder
          className="h-12 w-12 text-[#e8a317]"
          fill="#f6c453"
          strokeWidth={1.3}
        />
      </div>

      {/* Folder name */}
      <div className="mt-2 flex justify-center">
        <p
          className="max-w-full truncate text-center text-[12px] text-[#222]"
          title={folder.name}
        >
          {folder.name}
        </p>
      </div>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(folder);
        }}
        title="Delete"
        className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-md bg-white text-[#555] opacity-0 shadow-sm transition group-hover:opacity-100 hover:bg-[#fde7e7] hover:text-[#c42b1c]"
      >
        <Trash2
          className="h-3.5 w-3.5"
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
};

export default FolderCard;

