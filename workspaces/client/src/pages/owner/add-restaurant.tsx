import { useApolloClient, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import { Button } from '../../components/button';
import { FormError } from '../../components/form-error';
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant';
import { MY_RESTAURANTS_QUERY } from './MyRestaurants';

const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      ok
      error
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: createRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;

    if (ok) {
      const { name, address, categoryName } = getValues();

      setUploading(false);

      // 웹에 있는 캐시 정보를 봄
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });

      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: 'Category',
                  __proto__: Object,
                },
                coverImg: '/',
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: 'Restaurant',
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push('/');
    }
  };

  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables
  >(CREATE_RESTAURANT_MUTATION, {
    onCompleted,
  });

  const { register, getValues, formState, errors, handleSubmit } = useForm<IFormProps>({
    mode: 'onChange',
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const onSubmit = async () => {
    setUploading(true);
    try {
      const { file, name, address, categoryName } = getValues();

      const actualFile = file[0];
      const formBody = new FormData();

      formBody.append('file', actualFile);

      // amazon is not working now
      //   const { url } = await (
      //     await fetch('http://localhost:4000/uploads/', {
      //       method: 'post',
      //       body: formBody,
      //     })
      //   ).json();

      await createRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg: '/',
          },
        },
      });
    } catch (err) {}
  };

  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant</title>
      </Helmet>
      <h1 className="font-semibold text-2xl mb-3">Add Restaurant</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-3 mt-5 max-w-screen-md w-full mb-3"
      >
        <input
          ref={register({ required: 'Name is required.' })}
          name="name"
          placeholder="Name"
          className="input"
          type="text"
        />
        <input
          ref={register({ required: 'Address is required.' })}
          name="address"
          placeholder="Address"
          className="input"
          type="text"
        />
        <input
          ref={register({ required: 'Category Name is required.' })}
          name="categoryName"
          placeholder="Category Name"
          className="input"
          type="text"
        />
        <div>
          <input type="file" name="file" ref={register({ required: true })} accept="image/*" />
        </div>
        <Button loading={uploading} canClick={formState.isValid} actionText={'Create Restaurant'} />
        {data?.createRestaurant?.error && <FormError errorMessage={data.createRestaurant.error} />}
      </form>
    </div>
  );
};
