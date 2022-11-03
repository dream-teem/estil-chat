import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import _ from 'lodash';

export const ReqUserId = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  const request: Request = context.switchToHttp().getRequest<Request>();
  const userId = <string | undefined>request.cookies.user_id;

  if (!userId || !_.isNumber(parseInt(userId, 10))) {
    return null;
  }

  return parseInt(userId, 10);
});
