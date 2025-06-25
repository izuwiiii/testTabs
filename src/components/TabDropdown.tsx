import { Dropdown, DropdownItem } from "flowbite-react";
import type { ITab } from "../types/Tab";
import type React from "react";

interface ITabDropdown {
  tabs: ITab[];
  onSelect: (tabName: string) => void;
}

export const TabDropdown: React.FC<ITabDropdown> = () => {
  return (
    <Dropdown dismissOnClick={false}>
      <DropdownItem>Dashboard</DropdownItem>
    </Dropdown>
  );
};
