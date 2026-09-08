
import { useState } from "react";
import { X, FolderPlus } from "lucide-react";

const CreateFolderModal = ({
  isOpen,
  onClose,
  onCreate,
  loading,
}) => {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    const success = await onCreate(name.trim());

    if (success) {
      setName("");
      onClose();
    }
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 backdrop-blur-[1px]">
      <div className="w-full max-w-[420px] overflow-hidden rounded-lg border border-[#d6d6d6] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e5e5] px-5 py-4">
          <div className="flex items-center gap-3">
            <FolderPlus
              className="h-5 w-5 text-[#0078d4]"
              strokeWidth={1.8}
            />

            <h2 className="text-[15px] font-semibold text-[#1f1f1f]">
              Create new folder
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#666] transition hover:bg-[#e9e9e9] hover:text-[#222]"
            aria-label="Close"
          >
            <X className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-5 py-5">
            <label
              htmlFor="folder-name"
              className="mb-2 block text-[13px] text-[#333]"
            >
              Folder name
            </label>

            <input
              id="folder-name"
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New folder"
              className="h-9 w-full rounded-md border border-[#a8a8a8] bg-white px-3 text-[13px] text-[#1f1f1f] outline-none transition placeholder:text-[#888] hover:border-[#888] focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4]"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 border-t border-[#e5e5e5] bg-[#fafafa] px-5 py-3">
            <button
              type="button"
              onClick={handleClose}
              className="h-9 min-w-[80px] rounded-md border border-[#c8c8c8] bg-white px-4 text-[13px] text-[#333] transition hover:bg-[#f3f3f3]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || loading}
              className="h-9 min-w-[80px] rounded-md bg-[#0078d4] px-4 text-[13px] font-medium text-white transition hover:bg-[#106ebe] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFolderModal;

