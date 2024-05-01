import { ThrottlerModuleOptions } from '@nestjs/throttler';

export const throttleConfig: ThrottlerModuleOptions = [
  {
    name: 'short',
    ttl: 1000,
    limit: 5,
  },
  {
    name: 'medium',
    ttl: 10000,
    limit: 50,
  },
  {
    name: 'long',
    ttl: 60000,
    limit: 300,
  },
];
