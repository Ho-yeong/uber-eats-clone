import React from 'react';
import { restaurant_restaurant_restaurant_menu_options } from '../__generated__/restaurant';

interface IDishProps {
  name: string;
  price: number;
  description: string;
  photo: string | null;
  dishId?: number;
  isCustomer?: boolean;
  options?: restaurant_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  addItemToOrder?: (dishId: number) => void;
  isSelected?: boolean;
  removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  price,
  description,
  name,
  photo,
  dishId = 0,
  isCustomer = false,
  options,
  orderStarted = false,
  addItemToOrder,
  isSelected,
  removeFromOrder,
  children: dishOption,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        addItemToOrder(dishId);
      }
      if (isSelected && removeFromOrder) {
        removeFromOrder(dishId);
      }
    }
  };

  return (
    <div
      className={`py-4 px-8 border  transition-all grid grid-cols-3 cursor-pointer ${
        isSelected ? 'border-gray-800' : 'hover:border-gray-800'
      }`}
    >
      <div className="col-span-2">
        <div className="mb-5">
          <h3 className="text-lg font-medium">
            {name}
            {orderStarted && (
              <button
                className={`ml-3 py-1 px-3 focus:outline-none text-sm text-white ${
                  isSelected ? 'bg-red-500' : 'bg-lime-600'
                }`}
                onClick={onClick}
              >
                {isSelected ? 'Remove' : 'Add'}
              </button>
            )}
          </h3>
          <h4 className="font-medium">{description}</h4>
        </div>
        <span>$ {price}</span>
      </div>
      <div className="bg-cover py-10 bg-center" style={{ backgroundImage: `url(${photo})` }} />
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-5 mb-3 font-medium">Dish Options</h5>
          {dishOption}
        </div>
      )}
    </div>
  );
};
