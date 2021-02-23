import React from 'react';

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ coverImg, name, categoryName }) => {
  return (
    <div className="flex flex-col">
      <div
        style={{ backgroundImage: `url(${coverImg})` }}
        className="bg-cover bg-center mb-3 py-24 mt-10"
      />
      <h3 className="text-lg font-bold">{name}</h3>
      <span className="border-t py-2 mt-3 text-xs opacity-50 border-gray-400">{categoryName}</span>
    </div>
  );
};
