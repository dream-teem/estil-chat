import type { AppEnvVars } from '@/config';

import { Payload } from '../src/modules/auth';

export declare global {
  type AnyObject = Record<string, unknown>;

  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends AppEnvVars {}
  }

  namespace Express {
    interface Request {
      id: string;
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends Payload {}
  }
}
