import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory, useParams } from 'react-router';
import { Button } from '../../components/button';
import { createDish, createDishVariables } from '../../__generated__/createDish';
import { MY_RESTAURNAT_QUERY } from './my-restaurant';

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  [key: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();

  const { handleSubmit, register, formState, getValues, setValue } = useForm<IForm>({
    mode: 'onChange',
  });

  const [createDishMutation, { loading }] = useMutation<createDish, createDishVariables>(
    CREATE_DISH_MUTATION,
    {
      refetchQueries: [
        {
          query: MY_RESTAURNAT_QUERY,
          variables: {
            input: {
              id: +restaurantId,
            },
          },
        },
      ],
    },
  );

  const onSubmit = async () => {
    const { name, description, price, ...rest } = getValues();
    const optionObject = optionsNumber.map(theId => ({
      name: rest[`${theId}-OptionName`],
      extra: +rest[`${theId}-OptionExtra`],
    }));

    if (!loading) {
      await createDishMutation({
        variables: {
          input: {
            name,
            price: +price,
            description,
            restaurantId: +restaurantId,
            options: optionObject,
          },
        },
      });
      history.goBack();
    }
  };

  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber(prev => [Date.now(), ...prev]);
  };

  const onDeleteClick = (idToDelete: number) => {
    setOptionsNumber(prev => prev.filter(id => id !== idToDelete));
    setValue(`${idToDelete}-OptionName`, '');
    setValue(`${idToDelete}-OptionExtra`, '');
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Dish | Uber Eats</title>
      </Helmet>
      <h1 className="font-semibold text-2xl mb-3">Add Dish</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 mt-5 max-w-screen-md w-full mb-3"
      >
        <input
          className="input"
          type="text"
          name="name"
          placeholder="Name"
          ref={register({ required: 'Name is required.' })}
        />
        <input
          className="input"
          type="number"
          name="price"
          min={0}
          placeholder="Price"
          ref={register({ required: 'Price is required.' })}
        />
        <input
          className="input"
          type="text"
          name="description"
          placeholder="Description"
          ref={register({ required: 'Description is required.' })}
        />
        <div className="my-10">
          <h4 className="font-medium mb-3 text-lg">Dish OPtions</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            Add Dish Option
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map(id => {
              return (
                <div key={id} className="mt-5">
                  <input
                    ref={register()}
                    name={`${id}-OptionName`}
                    className="py-2 px-4 focus:outline-none mr-3 focus:border-gray-600 border-2"
                    type="text"
                    placeholder="Option name"
                  />
                  <input
                    ref={register()}
                    name={`${id}-OptionExtra`}
                    className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                    type="number"
                    min={0}
                    placeholder="extra price"
                  />
                  <span
                    onClick={() => {
                      onDeleteClick(id);
                    }}
                    className="cursor-pointer text-white bg-red-500 py-3 px-4 mt-5 ml-5"
                  >
                    Delete Option
                  </span>
                </div>
              );
            })}
        </div>
        <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
