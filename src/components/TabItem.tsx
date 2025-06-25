interface TabProps {
  name: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export const Tab: React.FC<TabProps> = ({ name, icon, active, onClick }) => {
  return (
    <button
      // className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-200 transition ${
      //   active ? "bg-gray-300 font-semibold" : ""
      // }`}
      onClick={onClick}
    >
      {icon}
      {name}
    </button>
  );
};
