import { useEffect, useState } from 'react'
import { ShoppingCart, Package, Search } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Badge } from './components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { ProductCard } from './components/ProductCard'
import { ShoppingCart as ShoppingCartComponent } from './components/ShoppingCart'
import { ProductDetails } from './components/ProductDetails'
import { CheckoutPage } from './components/CheckoutPage'
import { IntroPage } from './components/IntroPage'
import { HomePage } from './components/HomePage'
import { AdminPanel } from './components/AdminPanel'
import { BankSettings } from './components/BankSettings'
import { LoginModal } from './components/LoginModal'
import { OrdersPanel } from './components/OrdersPanel'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner@2.0.3'
import { projectId, publicAnonKey } from './utils/supabase/info'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category?: string
  reviews?: any[]
}

interface CartItem {
  productId: string
  product: Product
  quantity: number
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<{ items: CartItem[] }>({ items: [] })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'checkout' | 'intro'>('home')
  const [currentUser, setCurrentUser] = useState<{ username: string; role: 'admin' | 'user' } | null>(() => {
    try {
      const raw = localStorage.getItem('osm_user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const handleLogin = (user: { username: string; role: 'admin' | 'user' }) => setCurrentUser(user)
  const handleLogout = () => setCurrentUser(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const userId = 'guest-user' // In a real app, this would come from authentication

  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-f3a661bc`

  // Fetch products
  useEffect(() => {
    fetchProducts()
    fetchCart()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    }
  }

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setCart(data.cart)
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    }
  }

  const handleAddProduct = async (product: {
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
  }) => {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(product)
      })
      const data = await response.json()
      if (data.success) {
        setProducts([...products, data.product])
        toast.success('Product added successfully!')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    }
  }

  const handleAddToCart = async (product: Product) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1
        })
      })
      const data = await response.json()
      if (data.success) {
        setCart(data.cart)
        toast.success(`${product.name} added to cart`)
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart')
    }
  }

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ quantity })
      })
      const data = await response.json()
      if (data.success) {
        setCart(data.cart)
      }
    } catch (error) {
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
    }
  }

  const handleRemoveFromCart = async (productId: string) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${userId}/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setCart(data.cart)
        toast.success('Item removed from cart')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove from cart')
    }
  }

  const handleViewDetails = async (product: Product) => {
    try {
      const response = await fetch(`${API_BASE}/products/${product.id}`, {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setSelectedProduct(data.product)
        setShowProductDetails(true)
      }
    } catch (error) {
      console.error('Error fetching product details:', error)
      toast.error('Failed to load product details')
    }
  }

  const handleSubmitReview = async (
    productId: string,
    review: { customerName: string; rating: number; comment: string }
  ) => {
    try {
      const response = await fetch(`${API_BASE}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          productId,
          ...review
        })
      })
      const data = await response.json()
      if (data.success) {
        toast.success('Review submitted successfully!')
        // Refresh product details
        handleViewDetails(selectedProduct!)
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review')
    }
  }

  const handlePlaceOrder = async (orderData: any) => {
    const saveLocalOrder = (order: any) => {
      try {
        const raw = localStorage.getItem('osm_orders')
        const existing = raw ? JSON.parse(raw) : []
        localStorage.setItem('osm_orders', JSON.stringify([order, ...existing]))
      } catch (e) {
        console.error('Failed to save local order', e)
      }
    }

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(orderData)
      })
      const data = await response.json()

      // determine order id and status
      const id = orderData.paymentReference || `ORDER-${Date.now()}`
      const status = orderData.paymentMethod === 'bank-transfer' ? 'pending' : (data?.success ? 'paid' : 'pending')

      const localOrder = {
        id,
        createdAt: Date.now(),
        total: orderData.total || 0,
        items: orderData.items || [],
        paymentMethod: orderData.paymentMethod,
        paymentReference: orderData.paymentReference,
        status
      }

      saveLocalOrder(localOrder)

      if (data.success) {
        setCart({ items: [] })
        toast.success('Order placed successfully!')
      } else {
        // still return data but notify
        toast('Order recorded locally')
      }

      return data
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order to server — order saved locally')

      // save as local fallback
      const id = orderData.paymentReference || `ORDER-${Date.now()}`
      const localOrder = {
        id,
        createdAt: Date.now(),
        total: orderData.total || 0,
        items: orderData.items || [],
        paymentMethod: orderData.paymentMethod,
        paymentReference: orderData.paymentReference,
        status: orderData.paymentMethod === 'bank-transfer' ? 'pending' : 'paid'
      }
      try {
        const raw = localStorage.getItem('osm_orders')
        const existing = raw ? JSON.parse(raw) : []
        localStorage.setItem('osm_orders', JSON.stringify([localOrder, ...existing]))
      } catch (e) {
        console.error('Failed to save local order', e)
      }

      // clear cart locally when order created
      setCart({ items: [] })

      return { success: false }
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]

  const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

  if (currentView === 'checkout') {
    return (
      <>
        <CheckoutPage
          cart={cart}
          onBack={() => setCurrentView('shop')}
          onPlaceOrder={handlePlaceOrder}
        />
        <Toaster />
      </>
    )
  }

  if (currentView === 'home') {
    return (
      <>
        <HomePage
          onEnterShop={() => setCurrentView('shop')}
          onOpenAbout={() => setCurrentView('intro')}
        />
        <Toaster />
      </>
    )
  }

  if (currentView === 'intro') {
    return (
      <>
        <IntroPage onBack={() => setCurrentView('shop')} />
        <Toaster />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-primary" />
              <div>
                <h1>Irish Shop</h1>
                <p className="text-sm text-muted-foreground">Quality Products from Ireland</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {currentUser?.role === 'admin' && <AdminPanel onAddProduct={handleAddProduct} />}
              {currentUser?.role === 'admin' && <BankSettings />}
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('home')}>
                Home
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('intro')}>
                About Us
              </Button>

              <LoginModal onLogin={handleLogin} onLogout={handleLogout} currentUser={currentUser} />
              <OrdersPanel currentUser={currentUser} />

              <ShoppingCartComponent
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveFromCart}
                onCheckout={() => setCurrentView('checkout')}
              >
                <Button variant="outline" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
                      {cartItemCount}
                    </Badge>
                  )}
                </Button>
              </ShoppingCartComponent>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category === 'all' ? 'All Products' : category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {products.length === 0 ? 'No products available. Add some products to get started!' : 'No products found.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}
      </main>

      {/* Product Details Modal */}
      <ProductDetails
        product={selectedProduct}
        open={showProductDetails}
        onClose={() => setShowProductDetails(false)}
        onAddToCart={handleAddToCart}
        onSubmitReview={handleSubmitReview}
      />

      <Toaster />
    </div>
  )
}
