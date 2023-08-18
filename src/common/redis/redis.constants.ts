export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const REDIS_CLIENT_OPTIONS = Symbol('REDIS_CLIENT_OPTIONS');

export enum CacheKeyEnum {
  AuthRefreshToken = 'auth:refresh-token-blacklist',
}
