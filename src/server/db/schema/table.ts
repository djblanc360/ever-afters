import { pgTableCreator } from 'drizzle-orm/pg-core';

// Create a pgTable helper that automatically prefixes table names with 'afters_'
export const pgTable = pgTableCreator((name) => `afters_${name}`); 