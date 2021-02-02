# uber-eats-clone

### typescript - react & NestJS
### postgresql

## libraries - server
- yarn add @nestjs/graphql graphql-tools graphql apollo-server-express
- yarn add class-validator class-transformer
- yarn add @nestjs/typeorm typeorm
- yarn add @nestjs/config
- yarn add cross-env
- yarn add joi (env validator)
- yarn add bcrypt
- yarn add @types/bcrypt -D
- yarn add jsonwebtoken
- yarn add @types/jsonwebtoken -D
- yarn add got
- yarn add form-data

## libraries - client
- yarn add @apollo/client
- yarn add apollo (global also!)
- yarn add react-hook-form
- yarn add postcss
- yarn add autofixer
- yarn add tailwind
- yarn add tailwindcss
- 

# apollo code
- apollo client:codegen mytypes.d.ts --target=typescript

## User Model:
- id
- createdAt
- updatedAt

- email
- password
- role(client|owner|delivery)

## User CRUD

- Create Account
- Log In
- See Profile
- Edit Profile
- Verify Email