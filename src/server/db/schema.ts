import { pgTableCreator } from 'drizzle-orm/pg-core';
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

// Create a pgTable helper that automatically prefixes table names with 'afters_'
export const pgTable = pgTableCreator((name) => `afters_${name}`); 

export * from './schema/user';
export * from './schema/rave';
export * from './schema/venue';
