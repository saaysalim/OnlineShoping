import React from 'react'
import { Button } from './ui/button'

interface IntroPageProps {
  onBack: () => void
}

export function IntroPage({ onBack }: IntroPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Irish Shop — About Us</h1>
              <p className="text-sm text-muted-foreground">Proudly based in Limerick, Ireland</p>
            </div>
            <div>
              <Button variant="outline" onClick={onBack}>Back to Shop</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Who we are</h2>
          <p className="mb-4 text-muted-foreground">
            Irish Shop is a Limerick, Ireland based company dedicated to bringing high-quality
            products from Ireland to customers locally and internationally. We operate reliable
            online servers to keep our store fast and secure.
          </p>

          <h3 className="font-medium mb-2">Location</h3>
          <p className="mb-4">Limerick, County Limerick, Ireland</p>

          <h3 className="font-medium mb-2">Delivery</h3>
          <p className="mb-4">
            We offer next-day delivery within Ireland for orders placed before the daily cutoff time.
            International shipping options are available at checkout. Tracking and fast fulfillment
            are provided for all dispatches.
          </p>

          <h3 className="font-medium mb-2">Infrastructure</h3>
          <p className="mb-4 text-muted-foreground">
            Our platform is hosted on secure, scalable servers to ensure high availability and
            quick response times. If you need enterprise hosting or SLA details, contact our
            support team.
          </p>

          <h3 className="font-medium mb-2">Contact</h3>
          <p className="mb-1">Email: support@irish-shop.example</p>
          <p>Phone: +353 61 000 000</p>
        </div>
      </main>
    </div>
  )
}

export default IntroPage
