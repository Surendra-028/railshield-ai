// src/lib/db.ts
// We use 'global' so the list doesn't disappear when Next.js reloads
const globalForDb = global as unknown as { usersDB: any[] };

export const usersDB = globalForDb.usersDB || [];

if (process.env.NODE_ENV !== "production") globalForDb.usersDB = usersDB;