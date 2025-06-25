import { useParams } from "react-router";

export const TabContent = () => {
  const params = useParams();
  console.log(params.tab);
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        {params.tab} content
      </h1>
    </div>
  );
};
