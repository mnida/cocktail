"use client"

import { useState, useEffect } from "react"
import { getPickupOrders } from "../actions/order"
import { QueryResultRow } from "@vercel/postgres"

interface Order {
  id: number
  name: string
  created_at: string
}

export default function PickupPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [newOrderIds, setNewOrderIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const result = await getPickupOrders()
        if (result.success && result.data) {
          // Check for new orders
          const newIds = new Set<number>()
          result.data.forEach((order: QueryResultRow) => {
            const typedOrder = order as Order
            if (!orders.some(existingOrder => existingOrder.id === typedOrder.id)) {
              newIds.add(typedOrder.id)
            }
          })
          
          if (newIds.size > 0) {
            setNewOrderIds(newIds)
            // Clear highlight after 5 seconds
            setTimeout(() => {
              setNewOrderIds(new Set())
            }, 5000)
          }
          
          setOrders(result.data as Order[])
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      }
    }

    fetchOrders()
    const interval = setInterval(fetchOrders, 1000)
    return () => clearInterval(interval)
  }, [orders])

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Orders Ready for Delivery</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className={`p-6 rounded-lg shadow-md text-2xl font-semibold transition-all duration-500 transform ${
              newOrderIds.has(order.id) ? "bg-green-100" : "bg-gray-100"
            }`}
            style={{
              animation: newOrderIds.has(order.id) ? "slideDown 0.5s ease-out" : "none"
            }}
          >
            {order.name}
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
