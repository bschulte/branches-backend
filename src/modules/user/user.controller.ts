import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RequestWithUser } from 'src/shared/types';
import { AuthGuard } from 'src/shared/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  public login(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('token') token: string = '',
  ) {
    return this.userService.login(email, password, token);
  }

  @Post('/login-with-code')
  public loginWithCode(@Body('accessCode') accessCode: string) {
    return this.userService.loginWithCode(accessCode);
  }

  @Post('/request-password-reset')
  public requestPasswordReset(@Body('email') email: string) {
    return this.userService.generatePasswordResetToken(email);
  }

  @Post('/reset-password')
  public resetPassword(
    @Body('token') token: string,
    @Body('newPassword') newPassword: string,
    @Body('newPasswordDuplicate') newPasswordDuplicate: string,
  ) {
    return this.userService.resetPassword(
      token,
      newPassword,
      newPasswordDuplicate,
    );
  }

  @Get('/verify-auth')
  @UseGuards(AuthGuard)
  public verifyAuth(@Request() req: RequestWithUser) {
    return this.userService.findOne({ id: req.user.id });
  }

  @Post('/register')
  public register(@Body('name') name: string, @Body('email') email: string) {
    return this.userService.registerUser(name, email);
  }

  @Put('/change-password')
  @UseGuards(AuthGuard)
  public changePassword(
    @Request() req: RequestWithUser,
    @Body()
    {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string },
  ) {
    return this.userService.changePassword(
      req.user.email,
      currentPassword,
      newPassword,
    );
  }

  @Get('/login-records')
  @UseGuards(AuthGuard)
  public getLoginRecords(@Request() req: RequestWithUser) {
    return this.userService.getLoginActivity(req.user);
  }

  @Get('/api-key')
  @UseGuards(AuthGuard)
  public getApiKey(@Request() req: RequestWithUser) {
    return req.user.apiKey;
  }
}
