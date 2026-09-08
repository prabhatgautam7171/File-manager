
import {
  Home,
  Folder,
  Clock3,
  HardDrive,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ activeItem, setActiveItem }) => {
  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      disabled: true,
    },
    {
      id: "files",
      label: "My Files",
      icon: Folder,
    },
    {
      id: "recent",
      label: "Recent",
      icon: Clock3,
    },
  ];

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[#e5e5e5] bg-[#f7f7f7]">
      {/* App Header */}
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center">
            <Folder
              className="h-7 w-7 text-[#0078d4]"
              fill="currentColor"
              strokeWidth={1.5}
            />
          </div>

          <span className="text-[15px] font-semibold text-[#1f1f1f]">
            FileManager
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-2">
        <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-[#777]">
          Navigation
        </p>

        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => {
                  if (!item.disabled) {
                    setActiveItem(item.id);
                  }
                }}
                className={`group flex h-9 w-full items-center gap-3 rounded-md px-3 text-[13px] transition ${
                  isActive
                    ? "bg-[#e5f1fb] font-medium text-[#1f1f1f]"
                    : item.disabled
                      ? "cursor-default text-[#333]"
                      : "text-[#444] hover:bg-[#e9e9e9]"
                }`}
              >
                <Icon
                  className={`h-[17px] w-[17px] ${
                    isActive ? "text-[#0078d4]" : "text-[#555]"
                  }`}
                  strokeWidth={1.8}
                />

                <span>{item.label}</span>

                {isActive && (
                  <ChevronRight
                    className="ml-auto h-3.5 w-3.5 text-[#0078d4]"
                    strokeWidth={2}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Divider */}
      <div className="mx-4 my-4 h-px bg-[#dedede]" />

      {/* Storage */}
      <div className="px-3">
        <p className="mb-1 px-1 text-[11px] font-semibold uppercase tracking-wide text-[#777]">
          This PC
        </p>

        <div className="rounded-md px-2 py-2 hover:bg-[#e9e9e9]">
          <div className="flex items-center gap-3">
            <HardDrive
              className="h-[17px] w-[17px] text-[#555]"
              strokeWidth={1.8}
            />

            <span className="text-[13px] text-[#333]">
              Local Storage
            </span>
          </div>

          {/* Storage bar */}
          <div className="mt-2 ml-7">
            <div className="h-1.5 w-[calc(100%-8px)] overflow-hidden rounded-full bg-[#dedede]">
              <div className="h-full w-[35%] rounded-full bg-[#0078d4]" />
            </div>

            <p className="mt-1.5 text-[11px] text-[#777]">
              350 MB of 1 GB used
            </p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-auto px-4 pb-4">
        <p className="text-[11px] text-[#888]">
          FileManager
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

