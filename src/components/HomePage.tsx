import React from 'react'
import { ArrowRight, Boxes, Layers, ShieldCheck, Wrench } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface HomePageProps {
  onEnterShop: () => void
  onOpenAbout: () => void
}

const subdomains = {
  core: [
    'Checkout and Order Lifecycle',
    'Payment Orchestration and Reconciliation'
  ],
  supporting: [
    'Product Catalog Management',
    'Customer Shopping Experience',
    'Review Management',
    'Admin Operations'
  ],
  generic: [
    'Authentication and Session',
    'Notification and Email Dispatch',
    'File and Media Storage',
    'Reusable UI Component Framework'
  ]
}

function SubdomainCard({
  title,
  description,
  icon,
  items,
  tone
}: {
  title: string
  description: string
  icon: React.ReactNode
  items: string[]
  tone: string
}) {
  return (
    <Card className="h-full border-0 shadow-md bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className={`rounded-full p-2 ${tone}`}>{icon}</div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-slate-700">
          {items.map((item) => (
            <li key={item} className="rounded-md bg-slate-100 px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export function HomePage({ onEnterShop, onOpenAbout }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-slate-50 to-emerald-50 text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Model-Driven Design</p>
              <h1 className="text-3xl font-semibold">Online Shopping Domain Home</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-600">
                Main domain model and subdomain map for the Online Shopping platform.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onOpenAbout}>About Company</Button>
              <Button onClick={onEnterShop}>
                Enter Shop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <section className="mb-8">
          <Card className="border-0 bg-slate-900 text-white shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-white/10 p-2">
                  <Boxes className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle>Main Domain: Online Shopping</CardTitle>
                  <CardDescription className="text-slate-300">
                    Enable product discovery, cart management, checkout, payment, and order fulfillment.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-cyan-200 text-slate-900">Customer Experience</Badge>
                <Badge variant="secondary" className="bg-emerald-200 text-slate-900">Revenue and Settlement</Badge>
                <Badge variant="secondary" className="bg-amber-200 text-slate-900">Operational Control</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <SubdomainCard
            title="Core Subdomain"
            description="Differentiating business capabilities"
            icon={<Layers className="h-5 w-5 text-cyan-700" />}
            items={subdomains.core}
            tone="bg-cyan-100"
          />
          <SubdomainCard
            title="Supporting Subdomain"
            description="Capabilities that enable the core"
            icon={<Wrench className="h-5 w-5 text-emerald-700" />}
            items={subdomains.supporting}
            tone="bg-emerald-100"
          />
          <SubdomainCard
            title="Generic Subdomain"
            description="Reusable commodity capabilities"
            icon={<ShieldCheck className="h-5 w-5 text-amber-700" />}
            items={subdomains.generic}
            tone="bg-amber-100"
          />
        </section>
      </main>
    </div>
  )
}

export default HomePage
