import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Credentials, SignupCredentials } from "./Credentials";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UserInfo } from "./UserInfo";
import { UserService } from "../user/user.service";
import { User } from "src/user/base/User";

@Injectable()
export class AuthService {
  constructor(
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly userService: UserService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.userService.user({
      where: { username },
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      const { id, roles } = user;
      const roleList = roles as string[];
      return { id, username, roles: roleList };
    }
    return null;
  }
  async login(credentials: Credentials): Promise<UserInfo> {
    const { username, password } = credentials;
    const user = await this.validateUser(
      credentials.username,
      credentials.password
    );
    if (!user) {
      throw new UnauthorizedException("The passed credentials are incorrect");
    }
    const accessToken = await this.tokenService.createToken({
      id: user.id,
      username,
      password,
    });
    return {
      accessToken,
      ...user,
    };
  }

  async signup(credentials: SignupCredentials): Promise<UserInfo> {
    // Extract the username and password from the body of the request
    const { firstName, lastName, email, username, password, roles } =
      credentials;
    // Here we attempt to create a new user
    const user = await this.userService.createUser({
      data: {
        email,
        username,
        password,
        firstName,
        lastName,
        roles: [roles],
      },
    });
    // If creating a new user fails throw an error
    if (!user) {
      throw new UnauthorizedException("Could not create user");
    }
    // Create an access token for the newly created user
    const accessToken = await this.tokenService.createToken({
      id: user.id,
      username,
      password,
    });
    // Return the access token as well as the some details about the user
    return {
      accessToken,
      username: user.username,
      id: user.id,
      roles: (user.roles as { roles: string[] }).roles,
    };
  }

  async me(authorization: string = ""): Promise<User> {
    const bearer = authorization.replace(/^Bearer\s/, "");
    const username = this.tokenService.decodeToken(bearer);
    const result: any = await this.userService.user({
      where: { username },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        username: true,
        roles: true,
        email: true,
      },
    });
    if (!result) {
      throw new NotFoundException(`No resource was found for ${username}`);
    }

    return result;
  }

  async checkUser(email: string) {
    const userStatus: any = await this.userService.user({
      where: { email },
      select: { username: true, firstName: true, lastName: true, email: true },
    });
    if (!userStatus) {
      throw new NotFoundException(`No resource was found for ${email}`);
    }

    return userStatus;
  }
}
