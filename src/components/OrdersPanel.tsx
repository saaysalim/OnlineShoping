import React, { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'

type Order = {
  id: string
  createdAt: number
  total: number
  items: any[]
  paymentMethod: string
  paymentReference?: string
  status: 'pending' | 'paid' | 'shipped'
}

export function OrdersPanel({ currentUser }: { currentUser?: { username: string; role: string } | null }) {
  const [open, setOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    try {
      const raw = localStorage.getItem('osm_orders')
      setOrders(raw ? JSON.parse(raw) : [])
    } catch {
      setOrders([])
    }
  }

  const saveOrders = (next: Order[]) => {
    localStorage.setItem('osm_orders', JSON.stringify(next))
    setOrders(next)
  }

  const markPaid = (id: string) => {
    const next = orders.map(o => o.id === id ? { ...o, status: 'paid' } : o)
    saveOrders(next)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Orders</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Orders</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet.</p>
          ) : orders.map(order => (
            <div key={order.id} className="p-3 border rounded">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">Order {order.id}</div>
                  <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString()}</div>
                  <div className="text-sm">Total: €{order.total.toFixed(2)}</div>
                  <div className="text-sm">Method: {order.paymentMethod}</div>
                  {order.paymentReference && <div className="text-sm">Ref: {order.paymentReference}</div>}
                </div>
                <div className="text-right">
                  <div className="mb-2">Status: <strong>{order.status}</strong></div>
                  {order.status === 'pending' && (
                    <div className="flex flex-col gap-2">
                      {currentUser?.role === 'admin' ? (
                        <Button onClick={() => markPaid(order.id)}>Mark Paid</Button>
                      ) : (
                        <Button onClick={() => markPaid(order.id)}>I've Paid</Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default OrdersPanel
