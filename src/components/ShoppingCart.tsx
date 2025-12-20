import { Minus, Plus, Trash2, X } from 'lucide-react'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Separator } from './ui/separator'

interface CartItem {
  productId: string
  product: {
    id: string
    name: string
    price: number
    imageUrl: string
  }
  quantity: number
}

interface ShoppingCartProps {
  cart: { items: CartItem[] }
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void
  children: React.ReactNode
}

export function ShoppingCart({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  children 
}: ShoppingCartProps) {
  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  )

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({cart.items.length})</SheetTitle>
        </SheetHeader>
        
        <div className="mt-8 space-y-4">
          {cart.items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <>
              {cart.items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4>{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      €{item.product.price.toFixed(2)}
                    </p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveItem(item.productId)}
                        className="ml-auto"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    €{(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button 
                onClick={onCheckout} 
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
