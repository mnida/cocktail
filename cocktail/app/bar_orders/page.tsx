"use client"

import { useState, useEffect, useRef } from "react"
import { getOrders, updateOrderStatus } from "../actions/order"
import { QueryResultRow } from "@vercel/postgres"
import { cn } from "@/lib/utils"

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
  const [movingOrderId, setMovingOrderId] = useState<number | null>(null)
  const tableRef = useRef<HTMLTableElement>(null)

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

  const handleStatusChange = async (orderId: number, field: "claimed" | "completed", currentValue: boolean) => {
    try {
      if (!tableRef.current) return
      
      // Store positions of all rows before update
      const rows = tableRef.current.querySelectorAll('tbody tr')
      const initialPositions = new Map<number, DOMRect>()
      
      rows.forEach((row) => {
        const id = Number(row.getAttribute('data-order-id'))
        initialPositions.set(id, row.getBoundingClientRect())
      })

      // Update state with new order
      const result = await updateOrderStatus(orderId, field, !currentValue)
      
      if (result.success) {
        setMovingOrderId(orderId)
        setOrders(orders.map(order => {
          if (order.id === orderId) {
            return { ...order, [field]: !currentValue }
          }
          return order
        }).sort((a, b) => {
          if (a.completed !== b.completed) {
            return a.completed ? 1 : -1
          }
          if (a.claimed !== b.claimed) {
            return a.claimed ? 1 : -1
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        }))

        // After state update and re-render, animate from old to new positions
        requestAnimationFrame(() => {
          const newRows = tableRef.current?.querySelectorAll('tbody tr')
          if (!newRows) return

          newRows.forEach((row) => {
            const id = Number(row.getAttribute('data-order-id'))
            const initialPos = initialPositions.get(id)
            if (!initialPos) return

            const newPos = row.getBoundingClientRect()
            const deltaY = initialPos.top - newPos.top

            // Animate from old position to new position
            const htmlRow = row as HTMLElement
            htmlRow.style.transform = `translateY(${deltaY}px)`
            htmlRow.style.transition = 'none'

            requestAnimationFrame(() => {
              htmlRow.style.transition = 'transform 300ms ease-out'
              htmlRow.style.transform = 'translateY(0)'
            })
          })
        })

        setTimeout(() => {
          setMovingOrderId(null)
          if (tableRef.current) {
            const rows = tableRef.current.querySelectorAll('tbody tr')
            rows.forEach((row) => {
              const htmlRow = row as HTMLElement
              htmlRow.style.transform = ''
              htmlRow.style.transition = ''
            })
          }
        }, 300)
      } else {
        console.error(`Error updating order ${field}:`, result.error)
        setMovingOrderId(null)
      }
    } catch (error) {
      console.error(`Error updating order ${field}:`, error)
      setMovingOrderId(null)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left">Order ID</th>
              <th className="px-6 py-3 border-b text-left">Name</th>
              <th className="px-6 py-3 border-b text-left">Drink</th>
              <th className="px-6 py-3 border-b text-left">Created At</th>
              <th className="px-6 py-3 border-b text-left">Completed</th>
              <th className="px-6 py-3 border-b text-left">Claimed</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr 
                key={order.id}
                data-order-id={order.id}
                className={cn(
                  "hover:bg-gray-50",
                  movingOrderId === order.id && "bg-gray-50"
                )}
              >
                <td className="px-6 py-4 border-b">{order.id}</td>
                <td className="px-6 py-4 border-b">{order.name}</td>
                <td className="px-6 py-4 border-b">{order.drink}</td>
                <td className="px-6 py-4 border-b">
                  {new Date(order.created_at).toLocaleTimeString("en-US", {
                    timeZone: "America/New_York",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                  })}
                </td>
                <td className="px-6 py-4 border-b">
                  <input
                    type="checkbox"
                    checked={order.completed}
                    onChange={() => handleStatusChange(order.id, "completed", order.completed)}
                    className="h-8 w-8 cursor-pointer accent-green-600"
                  />
                </td>
                <td className="px-6 py-4 border-b">
                  <input
                    type="checkbox"
                    checked={order.claimed}
                    onChange={() => handleStatusChange(order.id, "claimed", order.claimed)}
                    className="h-8 w-8 cursor-pointer accent-blue-600"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
