import { pgTable, primaryKey, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { raves } from './rave';
import { venues } from './venue';

export const ravesToVenues = pgTable(
  'raves_to_venues',
  {
    raveId: integer('rave_id').notNull().references(() => raves.id),
    venueId: integer('venue_id').notNull().references(() => venues.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.raveId, t.venueId] }),
  })
);

export const ravesToVenuesRelations = relations(ravesToVenues, ({ one }) => ({
  venue: one(venues, {
    fields: [ravesToVenues.venueId],
    references: [venues.id],
  }),
  rave: one(raves, {
    fields: [ravesToVenues.raveId],
    references: [raves.id],
  }),
})); 