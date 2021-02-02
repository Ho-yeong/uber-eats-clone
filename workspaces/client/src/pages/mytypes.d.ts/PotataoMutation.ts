/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PotataoMutation
// ====================================================

export interface PotataoMutation_login {
  __typename: "LoginOutput";
  ok: boolean;
  error: string | null;
  token: string | null;
}

export interface PotataoMutation {
  login: PotataoMutation_login;
}

export interface PotataoMutationVariables {
  email: string;
  password: string;
}
