import { ShoppingCart, Star } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  category?: string
  reviews?: any[]
}

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onViewDetails: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => onViewDetails(product)}
            onError={(e) => {
              console.warn('Product image failed to load:', product.imageUrl)
              e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image'
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 
            className="cursor-pointer hover:underline"
            onClick={() => onViewDetails(product)}
          >
            {product.name}
          </h3>
          {product.category && (
            <Badge variant="secondary" className="text-xs shrink-0">
              {product.category}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {product.description}
        </p>
        {product.reviews && product.reviews.length > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">
              {averageRating.toFixed(1)} ({product.reviews.length})
            </span>
          </div>
        )}
        <div className="text-xl text-primary">
          €{product.price.toFixed(2)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          onClick={() => onViewDetails(product)} 
          variant="outline"
          className="flex-1"
        >
          View Details
        </Button>
        <Button 
          onClick={() => onAddToCart(product)}
          className="flex-1"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
