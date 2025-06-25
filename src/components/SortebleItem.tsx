import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import React from "react";
import "./Tab.css";

interface Props {
  id: string;
  img: string;
  activeTab: string;
  onClick?: (tab: string) => void;
}

export const SortableItem: React.FC<Props> = ({
  id,
  img,
  activeTab,
  onClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "15px 0px",
    backgroundColor: isDragging ? "#7F858D" : "",
    color: isDragging ? "#FFFFFF" : "",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    width: "100%",
    cursor: "pointer",
    zIndex: isDragging ? "999" : "1",
  };

  return (
    <div
      className={classNames("tab", { "tab--is-active": activeTab === id })}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => {
        onClick?.(id);
      }}
    >
      <img className="tab__logo" src={img} alt={img} />
      {id}
    </div>
  );
};
