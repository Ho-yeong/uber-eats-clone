/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import { gql, useMutation } from '@apollo/client';
import logo from '../images/logo.svg';
import { Button } from '../components/button';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { UserRole } from '../__generated__/globalTypes';
import { createAccountMutation, createAccountMutationVariables } from '../__generated__/createAccountMutation';

const CREATE_ACCOUNT_MUTATION = gql`
    mutation  createAccountMutation($createAccountInput: CreateAccountInput!) {
        createAccount(input: $createAccountInput){
            ok
            error
        }
    }

`;

interface ICreateAccountForm {
    email:string;
    password: string;
    role: UserRole;
}

export const CreateAccount = () => {

    const { register, errors, handleSubmit, formState, getValues } = useForm<ICreateAccountForm>({
        mode: "onChange",
        defaultValues: {
            role : UserRole.Client
        }
    });

    const history = useHistory();

    const onCompleted = (data: createAccountMutation) => {
        const { createAccount: { ok } } = data;
        if(ok){
            alert('Account Created! Log in now!')
            // redirect
            history.push('/')
        }
    }

    const [ createAccountMutation, { loading, data: createAccountMutationResult }  ] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION, {
        onCompleted
    });

    const onSubmit = () => {
        const { email, password, role } = getValues()
       if(!loading){
           createAccountMutation({
               variables: {
                   createAccountInput: {
                    email, password, role
                   }
               }
           })
       }
    }

    return (
        <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
            <Helmet>
                <title>Create Account | Uber eats</title>
            </Helmet>
            <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
                <img src={logo} className="w-52 mb-10"/>
                <h4 className="w-full font-medium text-left text-3xl mb-5">Let's get started</h4>
                <form 
                    className="grid gap-3 mt-5 w-full mb-3" 
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input 
                        ref={register({ required: "Email is required", pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })} 
                        type="email" 
                        name="email"
                        placeholder="Email" 
                        className="input"
                    />
                    {errors.email?.message && (
                        <FormError errorMessage={errors.email?.message}/>
                    )}
                    {errors.email?.type && (
                        <FormError errorMessage={"Please enter a valid email"}/>
                    )}
                    <input 
                        ref={register({ required: "Password is required", minLength: 10 })} 
                        type="password"
                        name="password"
                        placeholder="Password" 
                        className="input mb-3"
                    />
                    {errors.password?.message && (
                        <FormError errorMessage={errors.password?.message}/>
                    )}
                    {errors.password?.type === "minLength" && (
                        <FormError errorMessage={"Password must be more than 10 chars."}/>
                    )}
                    <select name="role" ref={register({ required : true })} className="input">
                        {Object.keys(UserRole).map(role => (<option key={role}>{role}</option>))}
                    </select>
                    <Button canClick={formState.isValid} loading={false} actionText={"Sign up"} />
                    {createAccountMutationResult?.createAccount.error &&
                        <FormError errorMessage={createAccountMutationResult.createAccount.error}/>}
                </form>
                <div>
                    Already use Uber? {" "}
                    <Link to="/" className="text-lime-600 hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
        )
}