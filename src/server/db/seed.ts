import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { users, usersToRaves } from './schema/user';
import { raves, ravesToVenues } from './schema/rave';
import { venues } from './schema/venue';

const db = drizzle(sql);

async function main() {
  console.log('Seeding database...');

  // Create users
  const usersList = [
    { username: 'raveMaster', email: 'ravemaster@test.com', passwordHash: 'hash123' },
    { username: 'danceLover', email: 'dance@test.com', passwordHash: 'hash456' },
    { username: 'nightOwl', email: 'night@test.com', passwordHash: 'hash789' },
    { username: 'beatKeeper', email: 'beats@test.com', passwordHash: 'hash101' },
    { username: 'grooveMaster', email: 'groove@test.com', passwordHash: 'hash202' },
  ];

  // Create venues
  const venuesList = [
    { name: 'Underground Bass', address: '123 Bass St', capacity: 500 },
    { name: 'Neon Dreams', address: '456 Neon Ave', capacity: 1000 },
    { name: 'Warehouse 13', address: '789 Industrial Blvd', capacity: 2000 },
    { name: 'The Echo Chamber', address: '321 Echo St', capacity: 800 },
    { name: 'Cosmic Gate', address: '654 Star Lane', capacity: 1500 },
    { name: 'Bass Station', address: '987 Sound Ave', capacity: 1200 },
  ];

  // Create raves
  const ravesList = [
    { name: 'Bass Drop 2024', theme: 'Bass Music', genre: 'Dubstep', 
      startTime: new Date('2024-03-15 20:00:00'), 
      endTime: new Date('2024-03-16 04:00:00') },
    { name: 'Neon Nights', theme: 'Neon', genre: 'House', startTime: new Date('2024-03-22 21:00:00'), endTime: new Date('2024-03-23 05:00:00') },
    { name: 'Techno Tuesday', theme: 'Underground', genre: 'Techno', startTime: new Date('2024-03-26 22:00:00'), endTime: new Date('2024-03-27 04:00:00') },
    { name: 'Trance State', theme: 'Trance', genre: 'Trance', startTime: new Date('2024-04-05 21:00:00'), endTime: new Date('2024-04-06 06:00:00') },
    { name: 'Drum & Bass Arena', theme: 'DnB', genre: 'Drum & Bass', startTime: new Date('2024-04-12 22:00:00'), endTime: new Date('2024-04-13 05:00:00') },
    { name: 'House Party', theme: 'Classic House', genre: 'House', startTime: new Date('2024-04-19 20:00:00'), endTime: new Date('2024-04-20 04:00:00') },
    { name: 'Bass Kingdom', theme: 'Bass Music', genre: 'Bass House', startTime: new Date('2024-04-26 21:00:00'), endTime: new Date('2024-04-27 05:00:00') },
    { name: 'Hardstyle Heaven', theme: 'Hard Dance', genre: 'Hardstyle', startTime: new Date('2024-05-03 22:00:00'), endTime: new Date('2024-05-04 06:00:00') },
    { name: 'Progressive Dreams', theme: 'Progressive', genre: 'Progressive House', startTime: new Date('2024-05-10 21:00:00'), endTime: new Date('2024-05-11 05:00:00') },
    { name: 'Deep Dark Disco', theme: 'Dark Disco', genre: 'Tech House', startTime: new Date('2024-05-17 22:00:00'), endTime: new Date('2024-05-18 04:00:00') },
    { name: 'Future Bass Fest', theme: 'Future Bass', genre: 'Future Bass', startTime: new Date('2024-05-24 20:00:00'), endTime: new Date('2024-05-25 04:00:00') },
    { name: 'Minimal Night', theme: 'Minimal', genre: 'Minimal Techno', startTime: new Date('2024-05-31 22:00:00'), endTime: new Date('2024-06-01 06:00:00') },
  ];

  try {
    // base tables
    const insertedUsers = await db.insert(users).values(usersList).returning();
    const insertedVenues = await db.insert(venues).values(venuesList).returning();
    const insertedRaves = await db.insert(raves).values(ravesList).returning();

    const userRaveRelations = insertedRaves.flatMap((rave) => 
      insertedUsers.slice(0, 3).map((user) => ({
        userId: user.id,
        raveId: rave.id,
        role: (user.id === insertedUsers[0].id ? 'host' : 'attendee') as 'host' | 'attendee',
      }))
    );
    await db.insert(usersToRaves).values(userRaveRelations);

    const raveVenueRelations = insertedRaves.map((rave) => ({
      raveId: rave.id,
      venueId: insertedVenues[Math.floor(Math.random() * insertedVenues.length)].id,
    }));
    await db.insert(ravesToVenues).values(raveVenueRelations);

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
