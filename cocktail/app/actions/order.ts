'use server'
import { sql } from '@vercel/postgres';

export async function createOrder(name: string, drink: string) {
  try {
    await sql`INSERT INTO orders (name, drink, created_at, claimed, completed) VALUES (${name}, ${drink}, NOW(), false, false)`;
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getOrders() {
  try {
    const { rows } = await sql`
      SELECT id, name, drink, created_at, claimed, completed
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
      WHERE (completed = true AND claimed = false)
      ORDER BY created_at ASC
    `
    return { success: true, data: rows }
  } catch (error: any) {
    return { error: error.message }
  }
}

export async function updateOrderStatus(orderId: number, field: "claimed" | "completed", value: boolean) {
  try {
    console.log("Server: Updating status:", { orderId, field, value })
    if (field === "claimed") {
      await sql`UPDATE orders SET claimed = ${value} WHERE id = ${orderId}`
    } else {
      await sql`UPDATE orders SET completed = ${value} WHERE id = ${orderId}`
    }
    return { success: true }
  } catch (error: any) {
    console.error("Server: Error updating status:", error)
    return { error: error.message }
  }
}