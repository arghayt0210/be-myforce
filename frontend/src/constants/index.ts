export interface CookieOptions {
  expires?: number | Date;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

export const COOKIE_OPTIONS: CookieOptions = {
  expires: 365,
  secure: process.env.NEXT_PUBLIC_NODE_ENV === 'production',
  sameSite: 'strict', // Keep it strict
  path: '/',
};