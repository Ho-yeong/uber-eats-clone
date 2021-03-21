import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
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
}

export const AddDish = () => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();

  const { handleSubmit, register, formState, getValues } = useForm<IForm>({
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
    const { name, description, price } = getValues();

    if (!loading) {
      await createDishMutation({
        variables: {
          input: {
            name,
            price: +price,
            description,
            restaurantId: +restaurantId,
          },
        },
      });
      history.goBack();
    }
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
        <Button loading={loading} canClick={formState.isValid} actionText="Create Dish" />
      </form>
    </div>
  );
};
