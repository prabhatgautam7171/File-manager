
import {
  Search,
  Grid2X2,
  List,
  Upload,
  Plus,
  ChevronDown,
  ArrowDownUp,
  MoreHorizontal,
} from "lucide-react";

const Header = ({
  search,
  setSearch,
  viewMode,
  setViewMode,
  onUpload,
  onCreateFolder,
}) => {
  return (
    <header className="flex justify-between items-center border-b border-[#e5e5e5] bg-[#f9f9f9]">
      {/* Command Bar */}
      <div className="flex items-center gap-2 px-5 py-2.5">
        {/* New */}
        <button
          onClick={onCreateFolder}
          className="flex h-9 items-center gap-1.5 rounded-md px-3 text-sm text-[#1f1f1f] transition hover:bg-[#e8e8e8]"
        >
          <Plus className="h-4 w-4" strokeWidth={1.8} />
          <span>New</span>
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>

        {/* Upload */}
        <button
          onClick={onUpload}
          className="flex h-9 items-center gap-2 rounded-md px-3 text-sm text-[#1f1f1f] transition hover:bg-[#e8e8e8]"
        >
          <Upload className="h-4 w-4" strokeWidth={1.8} />
          <span>Upload</span>
        </button>

        <div className="mx-1 h-6 w-px bg-[#dedede]" />

        {/* Sort */}
        <button className="flex h-9 items-center gap-2 rounded-md px-3 text-sm text-[#1f1f1f] transition hover:bg-[#e8e8e8]">
          <ArrowDownUp className="h-4 w-4" strokeWidth={1.8} />
          <span className="hidden sm:inline">Sort</span>
          <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>

        {/* View */}
        <div className="flex h-9 items-center rounded-md hover:bg-[#e8e8e8]">
          <button
            onClick={() => setViewMode("grid")}
            title="Grid view"
            className={`flex h-9 w-9 items-center justify-center rounded-l-md transition ${
              viewMode === "grid"
                ? "bg-[#e2e2e2] text-[#1f1f1f]"
                : "text-[#555] hover:text-[#1f1f1f]"
            }`}
          >
            <Grid2X2 className="h-4 w-4" strokeWidth={1.8} />
          </button>

          <button
            onClick={() => setViewMode("list")}
            title="Details view"
            className={`flex h-9 w-9 items-center justify-center rounded-r-md transition ${
              viewMode === "list"
                ? "bg-[#e2e2e2] text-[#1f1f1f]"
                : "text-[#555] hover:text-[#1f1f1f]"
            }`}
          >
            <List className="h-4 w-4" strokeWidth={1.8} />
          </button>
        </div>

        {/* More */}
        <button
          title="More options"
          className="flex h-9 w-9 items-center justify-center rounded-md text-[#555] transition hover:bg-[#e8e8e8] hover:text-[#1f1f1f]"
        >
          <MoreHorizontal className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      {/* Search */}
      <div className="px-5 ">
        <div className="relative max-w-2xl">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#666]"
            strokeWidth={1.8}
          />

          <input
            type="text"
            placeholder="Search FileManager"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 w-full rounded-md border border-[#c8c8c8] bg-white pl-10 pr-4 text-sm text-[#1f1f1f] outline-none transition placeholder:text-[#777] hover:border-[#a8a8a8] focus:border-[#0078d4] focus:ring-1 focus:ring-[#0078d4]"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

