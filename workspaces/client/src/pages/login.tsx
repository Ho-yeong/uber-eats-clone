import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
    mutation  PotataoMutation($email: String!, $password: String!) {
        login(input: {
            email: $email,
            password : $password
        }){
            ok
            error
            token
        }
    }

`;

interface ILoginForm {
    email:string;
    password: string;
}

export const Login = () => {

    const { register, getValues, errors, handleSubmit } = useForm<ILoginForm>();
    const [ loginMutation, { loading, error, data } ] = useMutation(LOGIN_MUTATION);

    const onSubmit = () => {
        const { email, password } = getValues();
        loginMutation({
            variables: {
                email, password
            }
        })
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-800">
            <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
                <h3 className="text-3xl text-gray-800">Log In</h3>
                <form 
                    className="grid gap-3 mt-5 px-5" 
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input 
                        ref={register({ required: "Email is required" })} 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        className="input"
                    />
                    {errors.email?.message && (
                        <FormError errorMessage={errors.email?.message}/>
                    )}
                    <input 
                        ref={register({ required: "Password is required", minLength: 10 })} 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        className="input"
                    />
                    {errors.password?.message && (
                        <FormError errorMessage={errors.password?.message}/>
                    )}
                    {errors.password?.type === "minLength" && (
                        <FormError errorMessage={"Password must be more than 10 chars."}/>
                    )}
                    <button className="mt-3 button">
                        Log In
                    </button>
                </form>
            </div>
        </div>
        )
}