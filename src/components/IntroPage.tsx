import React from 'react'
import { Button } from './ui/button'

interface IntroPageProps {
  onBack: () => void
}

export function IntroPage({ onBack }: IntroPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">Irish Shop — About Us</h1>
              <p className="text-sm text-gray-700 mt-1">Proudly based in Limerick, Ireland</p>
            </div>
            <div>
              <Button variant="outline" onClick={onBack}>Back to Shop</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
          <h2 className="text-2xl font-bold mb-4 text-black">Who we are</h2>
          <p className="mb-6 text-gray-800 leading-relaxed">
            Irish Shop is a Limerick, Ireland based company dedicated to bringing high-quality
            products from Ireland to customers locally and internationally. We operate reliable
            online servers to keep our store fast and secure.
          </p>

          <h3 className="text-lg font-bold mb-2 text-black">📍 Location</h3>
          <p className="mb-6 text-gray-800">Limerick, County Limerick, Ireland</p>

          <h3 className="text-lg font-bold mb-2 text-black">🚚 Delivery</h3>
          <p className="mb-6 text-gray-800 leading-relaxed">
            We offer next-day delivery within Ireland for orders placed before the daily cutoff time.
            International shipping options are available at checkout. Tracking and fast fulfillment
            are provided for all dispatches.
          </p>

          <h3 className="text-lg font-bold mb-2 text-black">🔒 Infrastructure</h3>
          <p className="mb-6 text-gray-800 leading-relaxed">
            Our platform is hosted on secure, scalable servers to ensure high availability and
            quick response times. If you need enterprise hosting or SLA details, contact our
            support team.
          </p>

          <h3 className="text-lg font-bold mb-2 text-black">📞 Contact</h3>
          <p className="mb-1 text-gray-800">Email: <span className="font-semibold">support@irish-shop.example</span></p>
          <p className="text-gray-800">Phone: <span className="font-semibold">+353 61 000 000</span></p>
        </div>
      </main>
    </div>
  )
}

export default IntroPage
