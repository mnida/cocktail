'use server'
import { sql } from '@vercel/postgres';

export async function createOrder(name: string, drink: string) {
  try {
    await sql`INSERT INTO orders (name, drink) VALUES (${name}, ${drink})`;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getOrders() {
  try {
    const { rows } = await sql`
      SELECT id, name, created_at, claimed, completed
      FROM orders
      ORDER BY 
        completed ASC,
        claimed ASC,
        created_at DESC
    `
    return { success: true, data: rows }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function getPickupOrders() {
  try {
    const { rows } = await sql`
      SELECT id, name, created_at
      FROM orders
      WHERE completed = false 
      AND claimed = true
      ORDER BY created_at DESC
    `
    return { success: true, data: rows }
  } catch (error: any) {
    return { error: error.message }
  }
}