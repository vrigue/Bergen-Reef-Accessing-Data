// app/api/auth/[auth0]/route.js
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
export const POST = handleAuth();
export const PUT = handleAuth();
export const DELETE = handleAuth();