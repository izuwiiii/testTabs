import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";
import React, { useEffect } from "react";
import "./Tab.css";
import { useParams } from "react-router";

interface Props {
  id: string;
  img: string;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  onClick?: (tab: string) => void;
  className?: string;
}

export const TabItem: React.FC<Props> = ({
  id,
  img,
  activeTab,
  setActiveTab,
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
  const params = useParams();

  useEffect(() => {
    if (params.tab) {
      setActiveTab(params.tab);
    }
  }, [params.tab, setActiveTab]);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        className={classNames("tab", "sortable-item", {
          "tab--is-active": activeTab === id,
          "sortable-item--dragging": isDragging,
        })}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        data-id={id}
        onClick={() => {
          if (!isDragging) {
            onClick?.(id);
          }
        }}
      >
        <img className="tab__logo" src={img} alt={img} />
        {id}
      </div>
    </>
  );
};
