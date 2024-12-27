import { SetMetadata } from '@nestjs/common';

export const RequireLogin = () => SetMetadata('requireLogin', true);

export const RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);
