import React from 'react';

interface IDishProps {
  name: string;
  price: number;
  description: string;
  photo: string | null;
}

export const Dish: React.FC<IDishProps> = ({ price, description, name, photo }) => {
  return (
    <div className=" py-4 px-8 border hover:border-gray-800 transition-all grid grid-cols-3">
      <div className="col-span-2">
        <div className="mb-5">
          <h3 className="text-lg font-medium">{name}</h3>
          <h4 className="">{description}</h4>
        </div>
        <span>$ {price}</span>
      </div>
      <div className="bg-cover py-10 bg-center" style={{ backgroundImage: `url(${photo})` }} />
    </div>
  );
};
