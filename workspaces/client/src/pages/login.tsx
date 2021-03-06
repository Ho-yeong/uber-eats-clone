/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { FormError } from '../components/form-error';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { loginMutation, loginMutationVariables } from '../__generated__/loginMutation';
import logo from '../images/logo.svg';
import { Button } from '../components/button';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { authTokenVar, isLoggedInVar } from '../apollo';
import { LOCALSTORAGE_TOKEN } from '../constants';
import { useForm } from 'react-hook-form';

const LOGIN_MUTATION = gql`
    mutation  loginMutation($loginInput: LoginInput!) {
        login(input: $loginInput){
            ok
            error
            token
        }

    }
  
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const { register, errors, handleSubmit, watch, formState } = useForm<ILoginForm>({
    mode: 'onBlur',
  });
  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
    } else {
      if (error) {
      }
    }
  };
  const onError = (error: ApolloError) => {};
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    variables: {
      loginInput: {
        email: watch('email'),
        password: watch('password'),
      },
    },
    onCompleted,
    onError,
  });

  const onSubmit = () => {
    if (!loading) {
      loginMutation();
    }
    // const { email, password } = getValues();
    // loginMutation({
    //     variables: {
    //         loginInput: {
    //             email,
    //             password
    //         }
    //     }
    // })
  };

  return (
    <div className="h-screen flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>Login | Uber eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <img src={logo} className="w-52 mb-10" />
        <h4 className="w-full font-medium text-left text-3xl mb-5">Welcome back</h4>
        <form className="grid gap-3 mt-5 w-full mb-3" onSubmit={handleSubmit(onSubmit)}>
          <input
            ref={register({
              required: 'Email is required',
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            type="email"
            name="email"
            placeholder="Email"
            className="input"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type && <FormError errorMessage={'Please enter a valid email'} />}
          <input
            ref={register({ required: 'Password is required', minLength: 10 })}
            type="password"
            name="password"
            placeholder="Password"
            className="input mb-3"
          />
          {errors.password?.message && <FormError errorMessage={errors.password?.message} />}
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage={'Password must be more than 10 chars.'} />
          )}
          <Button canClick={formState.isValid} loading={loading} actionText={'Log In'} />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          New to Uber?{' '}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
