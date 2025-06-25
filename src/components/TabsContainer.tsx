import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { SortableItem } from "./SortebleItem";

interface ITabs {
  img: string;
  name: string;
}

const tabs: ITabs[] = [
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
  const [items, setItems] = useState<ITabs[]>(tabs);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.name === active.id);
      const newIndex = items.findIndex((item) => item.name === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div className="p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.name)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex">
            {items.map((tab) => (
              <SortableItem
                key={tab.name}
                id={tab.name}
                img={tab.img}
                activeTab={activeTab}
                onClick={() => setActiveTab(tab.name)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
