"use client"

import { useState, useEffect } from "react"
import { getOrders } from "../actions/order"
import { QueryResultRow } from "@vercel/postgres"

interface Order {
  id: number
  name: string
  drink: string
  created_at: string
  claimed: boolean
  completed: boolean
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getOrders()
        if (result.success) {
          setOrders(result.data.map((row: QueryResultRow): Order => ({
            id: row.id,
            name: row.name,
            drink: row.drink,
            created_at: row.created_at,
            claimed: row.claimed,
            completed: row.completed
          })))
        } else {
          console.error("Error fetching orders:", result.error)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    const interval = setInterval(fetchOrders, 3000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Order ID</th>
              <th className="px-6 py-3 border-b text-left">Name</th>
              <th className="px-6 py-3 border-b text-left">Drink</th>
              <th className="px-6 py-3 border-b text-left">Created At</th>
              <th className="px-6 py-3 border-b text-left">Claimed</th>
              <th className="px-6 py-3 border-b text-left">Completed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b">{order.id}</td>
                <td className="px-6 py-4 border-b">{order.name}</td>
                <td className="px-6 py-4 border-b">{order.drink}</td>
                <td className="px-6 py-4 border-b">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 border-b">{order.claimed ? "Yes" : "No"}</td>
                <td className="px-6 py-4 border-b">{order.completed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
