import React from 'react';

interface IDishOptionProps {
  isSelected: boolean;
  dishId: number;
  name: string;
  extra: number | null;
  addOptionToItem: (dishId: number, optionName: string) => void;
  removeOptionFromItem: (dishId: number, optionName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  addOptionToItem,
  dishId,
  removeOptionFromItem,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };

  return (
    <span
      onClick={onClick}
      className={`flex items-center border py-1 px-3 mb-2 ${isSelected ? 'border-gray-800' : ''}`}
    >
      <h6 className="mr-2">{name}</h6>
      {extra && <h6 className="text-sm opacity-75">(${extra})</h6>}
    </span>
  );
};