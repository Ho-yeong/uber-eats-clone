import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Button } from '../../components/button'
import { createRestaurant, createRestaurantVariables } from '../../__generated__/createRestaurant'

const CREATE_RESTAURANT_MUTATION = gql`
    mutation createRestaurant ($iuput: CreateRestaurantInput!) {
        createRestaurant (input: $input) {
            ok
            error
        }

    }
`

interface IFormProps {
    name: string;
    address: string;
    categoryName: string;
}


export const AddRestaurant = () => {

    const [createRestaurantMutation, { loading, data }] = useMutation<
        createRestaurant, 
        createRestaurantVariables
    >(CREATE_RESTAURANT_MUTATION);


    const { register, getValues, formState, errors, handleSubmit} = useForm<IFormProps>({
        mode: "onChange"
    });


    const onSubmit = () => {
        console.log(getValues())
    }

    return (
        <div className="container">
            <Helmet>
                <title>Add Restaurant</title>
            </Helmet>
            <h1>Add Restaurant</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input 
                    ref={register({ required: "Name is required."})} 
                    name="name" 
                    placeholder="Name" 
                    type="text"
                />
                <input 
                    ref={register({ required: "Address is required."})} 
                    name="address" 
                    placeholder="Address" 
                    type="text"
                />
                <input 
                    ref={register({ required: "Category Name is required."})} 
                    name="categoryName" 
                    placeholder="Category Name" 
                    type="text"
                />
                <Button loading={loading} canClick={formState.isValid} actionText={"Create Restaurant"}/>
            </form>
        </div>
    )
}