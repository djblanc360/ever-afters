import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import * as schema from './schema';
export * from './schema/user';
export * from './schema/rave';
export * from './schema/venue';
// Export other schema files here

// Create Drizzle ORM instance
export const db = drizzle({ client: sql });

// For use in edge runtime
export const queryClient = sql;

export * from './schema';