import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { isEmpty } from 'lodash';

import type { UserRole } from '@/modules';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';

export const UseAuth = (...roles: UserRole[]): ReturnType<typeof applyDecorators> => applyDecorators(
  SetMetadata('roles', roles),
  UseGuards(JwtAuthGuard, RolesGuard),
  ApiBearerAuth(),
  ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  // if roles are specified, it can return 403
  !isEmpty(roles) ? ApiForbiddenResponse({ description: 'Forbidden insufficient role' }) : () => {},
);
