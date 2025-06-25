import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useEffect, useRef, useState } from "react";
import { TabItem } from "./TabItem";
import type { ITab } from "../types/Tab";
import { Link, Outlet } from "react-router";
import { getFromStorage, saveToStorage } from "../utils/storage";
import ThumbtackIcon from "../assets/fi-rs-thumbtack.svg";

const STORAGE_KEYS = {
  TABS_ORDER: "tabs_order",
  ACTIVE_TAB: "active_tab",
  PINNED_TABS: "pinned_tabs",
};

const restoreTabsOrder = (defaultTabs: ITab[]): ITab[] => {
  const savedOrder = getFromStorage(STORAGE_KEYS.TABS_ORDER);
  const pinnedTabs = getFromStorage<ITab[]>(STORAGE_KEYS.PINNED_TABS, []);

  const pinnedNames = new Set(pinnedTabs?.map((tab) => tab.name) ?? []);

  if (!savedOrder || !Array.isArray(savedOrder)) {
    return defaultTabs.filter((tab) => !pinnedNames.has(tab.name));
  }

  try {
    const tabsMap = new Map(defaultTabs.map((tab) => [tab.name, tab]));
    const restoredTabs: ITab[] = [];

    for (const tabName of savedOrder) {
      if (pinnedNames.has(tabName)) continue;

      const tab = tabsMap.get(tabName);
      if (tab) {
        restoredTabs.push(tab);
        tabsMap.delete(tabName);
      }
    }

    for (const [name, tab] of tabsMap) {
      if (!pinnedNames.has(name)) {
        restoredTabs.push(tab);
      }
    }

    return restoredTabs;
  } catch (error) {
    console.error("Error:", error);
    return defaultTabs.filter((tab) => !pinnedNames.has(tab.name));
  }
};

const tabs: ITab[] = [
  { img: "src/assets/fi-rs-apps.svg", name: "Dashboard" },
  { img: "src/assets/fi-rs-bank.svg", name: "Banking" },
  { img: "src/assets/fi-rs-phone-call.svg", name: "Telefonie" },
  { img: "src/assets/fi-rs-user-add.svg", name: "Accounting" },
  { img: "src/assets/fi-rs-shop.svg", name: "Verkauf" },
  { img: "src/assets/fi-rs-chart-pie.svg", name: "Statistik" },
  { img: "src/assets/fi-rs-post.svg", name: "Post Office" },
  { img: "src/assets/fi-rs-settings.svg", name: "Administration" },
  { img: "src/assets/fi-rs-book-alt.svg", name: "Help" },
  { img: "src/assets/fi-rs-cube.svg", name: "Warenbestand" },
  { img: "src/assets/fi-rs-list.svg", name: "Auswahllisten" },
  { img: "src/assets/fi-rs-shopping-cart-check.svg", name: "Einkauf" },
  { img: "src/assets/fi-rs-browser.svg", name: "Rechnung" },
];

export const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState("");
  const [items, setItems] = useState<ITab[]>(() => restoreTabsOrder(tabs));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [pinnedTabs, setPinnedTabs] = useState<ITab[]>(() =>
    getFromStorage<ITab[]>(STORAGE_KEYS.PINNED_TABS, [])
  );
  const [contextTab, setContextTab] = useState<ITab | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.name === active.id);
      const newIndex = items.findIndex((item) => item.name === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }

    setActiveId(null);
  };

  const menuRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleCloseMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const tabNames = items.map((tab) => tab.name);
    saveToStorage(STORAGE_KEYS.TABS_ORDER, tabNames);
    saveToStorage(STORAGE_KEYS.PINNED_TABS, pinnedTabs);
  }, [items, pinnedTabs]);

  useEffect(() => {
    if (activeTab) {
      saveToStorage(STORAGE_KEYS.ACTIVE_TAB, activeTab);
    }
  }, [activeTab]);

  const activeItem = activeId
    ? items.find((item) => item.name === activeId)
    : null;

  const [menuPosition, setMenuPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    let target = event.target as HTMLElement;

    while (target && !target.classList.contains("sortable-item")) {
      target = target.parentElement as HTMLElement;
    }

    if (!target) return;

    const tabName = target.getAttribute("data-id");
    if (!tabName) return;

    const tab = items.find((t) => t.name === tabName);
    if (!tab) return;

    setContextTab(tab);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const handleCloseMenu = () => setMenuPosition(null);

  return (
    <>
      {" "}
      <div className="p-6 overflow-hidden" onClick={() => handleCloseMenu()}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          onDragCancel={handleDragCancel}
        >
          <SortableContext
            items={items.map((item) => item.name)}
            strategy={horizontalListSortingStrategy}
          >
            <div
              className="tabs-container flex overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
              style={{
                height: "48px",
                alignItems: "center",
                gap: "8px",
              }}
              onContextMenu={(e) => {
                if (e.target.className.split(" ").includes("sortable-item")) {
                  handleContextMenu(e);
                }
              }}
            >
              {pinnedTabs.map((tab) => (
                <div
                  className="pinnedTab"
                  key={tab.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    height: "40px",
                    minWidth: "40px",
                  }}
                  onClick={() => setActiveTab(tab.name)}
                  onContextMenu={(event) => {
                    event.preventDefault();
                    setContextTab(tab);
                    setMenuPosition({ x: event.clientX, y: event.clientY });
                  }}
                >
                  <Link
                    to={`/${tab.name}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "40px",
                      backgroundColor:
                        activeTab === tab.name ? "#e0e0e0" : "transparent",
                    }}
                  >
                    <img
                      src={tab.img}
                      alt={tab.name}
                      title={tab.name}
                      className="pinnedTab"
                      style={{
                        width: "16px",
                        height: "16px",
                        cursor: "pointer",
                        padding: "0px",
                        borderRadius: "4px",
                        transition: "background-color 0.2s ease",
                        display: "block",
                        flexShrink: 0,
                      }}
                    />
                  </Link>
                </div>
              ))}

              {pinnedTabs.length > 0 && items.length > 0 && (
                <div
                  style={{
                    width: "1px",
                    height: "32px",
                    backgroundColor: "#e0e0e0",
                    margin: "0 4px",
                    flexShrink: 0,
                  }}
                />
              )}

              {items.map((tab) => (
                <Link
                  to={`/${tab.name}`}
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <TabItem
                    key={tab.name}
                    id={tab.name}
                    img={tab.img}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    data-id={tab.name}
                    className="sortable-item"
                  />
                </Link>
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {activeItem ? (
              <div
                style={{
                  padding: "15px 12px",
                  backgroundColor: "#7F858D",
                  color: "#FFFFFF",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "10px",
                  minWidth: "140px",
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  borderRadius: "4px",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                }}
              >
                <img
                  src={activeItem.img}
                  alt={activeItem.name}
                  style={{ flexShrink: 0, width: "20px", height: "20px" }}
                />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {activeItem.name}
                </span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {menuPosition && (
          <ul
            ref={menuRef}
            style={{
              position: "absolute",
              top: menuPosition.y,
              left: menuPosition.x,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "4px 0",
              listStyle: "none",
              zIndex: 1000,
              width: "180px",
            }}
            onClick={handleCloseMenu}
          >
            {!pinnedTabs.some((tab) => tab.name === contextTab?.name) && (
              <li
                className="flex items-center gap-2 px-4 py-2 text-[#7F858D] hover:bg-gray-100 cursor-pointer transition"
                onClick={() => {
                  if (contextTab) {
                    setPinnedTabs((prev) => [...prev, contextTab]);
                    setItems((prev) =>
                      prev.filter((item) => item.name !== contextTab.name)
                    );
                  }
                }}
              >
                <img src={ThumbtackIcon} alt="thumbtack" />
                Tab anpinnen
              </li>
            )}

            {pinnedTabs.some((tab) => tab.name === contextTab?.name) && (
              <li
                className="flex items-center gap-2 px-4 py-2 text-[#7F858D] hover:bg-gray-100 cursor-pointer transition"
                onClick={() => {
                  if (contextTab) {
                    setPinnedTabs((prev) =>
                      prev.filter((tab) => tab.name !== contextTab.name)
                    );
                    setItems((prev) => [...prev, contextTab]);
                  }
                }}
              >
                <img
                  src={ThumbtackIcon}
                  alt="thumbtack"
                  style={{ transform: "rotate(45deg)" }}
                />
                Tab loslösen
              </li>
            )}
          </ul>
        )}
      </div>
      <Outlet />
    </>
  );
};
