import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser } from '../auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOut } from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { Role } from '../auth/role.decorator';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(returns => CreateAccountOutput)
  createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation(returns => LoginOutput)
  login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Query(returns => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query(returns => UserProfileOutput)
  @Role(['Any'])
  userProfile(@Args() userProfileInput: UserProfileInput): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }

  @Mutation(returns => EditProfileOut)
  @Role(['Any'])
  editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOut> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation(returns => VerifyEmailOutput)
  verifyEmail(@Args('input') { code }: VerifyEmailInput) {
    return this.usersService.verifyEmail(code);
  }
}
