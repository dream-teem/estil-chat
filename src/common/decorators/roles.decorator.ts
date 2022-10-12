import { SetMetadata } from '@nestjs/common';

import type { UserRole } from '@/modules/user';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const HasRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
