'use server'
import { sql } from '@vercel/postgres';

export async function createOrder(name: string, drink: string) {
  try {
    await sql`INSERT INTO orders (name, drink) VALUES (${name}, ${drink})`;
    return { success: true };
  } catch {
    return { error: true };
  }
}