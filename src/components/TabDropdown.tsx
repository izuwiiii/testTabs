import { Dropdown, DropdownItem } from "flowbite-react";
import type { ITabs } from "../types/Tabs";
import type React from "react";

interface ITabDropdown {
  tabs: ITabs[],
  onSelect: (tabName: string) => void
}

export const TabDropdown: React.FC<ITabDropdown> = () => {
  return (
    <Dropdown dismissOnClick={false}>
      <DropdownItem>Dashboard</DropdownItem>
      <DropdownItem>Settings</DropdownItem>
      <DropdownItem>Earnings</DropdownItem>
      <DropdownItem>Sign out</DropdownItem>
    </Dropdown>
  );
}
