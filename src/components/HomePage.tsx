import React, { useState } from 'react'
import { ArrowRight, Boxes, Layers, ShieldCheck, Wrench, ChevronDown, Zap, Package, Lock } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface HomePageProps {
  onEnterShop: () => void
  onOpenAbout: () => void
}

const domainStructure = {
  mainDomain: {
    name: 'Online Shopping',
    description: 'Enable product discovery, cart management, checkout, payment, and order fulfillment',
    color: 'from-indigo-600 to-purple-600'
  },
  subdomains: {
    core: {
      title: 'Core Subdomains',
      type: 'CORE',
      description: 'Business-critical, differentiating capabilities',
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-300',
      badgeColor: 'bg-cyan-100 text-cyan-900',
      icon: <Zap className="h-6 w-6" />,
      items: [
        {
          name: 'Checkout and Order Lifecycle',
          description: 'Validate, create, and manage order states'
        },
        {
          name: 'Payment Orchestration & Reconciliation',
          description: 'Handle payment methods, generate refs, track status'
        }
      ]
    },
    supporting: {
      title: 'Supporting Subdomains',
      type: 'SUPPORTING',
      description: 'Enable core capabilities to function effectively',
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-300',
      badgeColor: 'bg-emerald-100 text-emerald-900',
      icon: <Wrench className="h-6 w-6" />,
      items: [
        {
          name: 'Product Catalog Management',
          description: 'Create, update, categorize products'
        },
        {
          name: 'Customer Shopping Experience',
          description: 'Browse, search, filter, and product details'
        },
        {
          name: 'Review Management',
          description: 'Capture and retrieve ratings/comments'
        },
        {
          name: 'Admin Operations',
          description: 'Manage products, orders, settlements'
        }
      ]
    },
    generic: {
      title: 'Generic Subdomains',
      type: 'GENERIC',
      description: 'Reusable commodity capabilities often found across systems',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      badgeColor: 'bg-amber-100 text-amber-900',
      icon: <Lock className="h-6 w-6" />,
      items: [
        {
          name: 'Authentication & Session',
          description: 'User login, role management, persistence'
        },
        {
          name: 'Notification & Email',
          description: 'Order confirmations, fallback storage'
        },
        {
          name: 'Media Storage',
          description: 'Product image storage and retrieval'
        },
        {
          name: 'UI Component Framework',
          description: 'Shared controls, dialogs, styling'
        }
      ]
    }
  }
}

function ExpandableSubdomainCard({
  title,
  type,
  description,
  items,
  color,
  bgColor,
  borderColor,
  badgeColor,
  icon
}: {
  title: string
  type: string
  description: string
  items: Array<{ name: string; description: string }>
  color: string
  bgColor: string
  borderColor: string
  badgeColor: string
  icon: React.ReactNode
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className={`border-2 ${borderColor} ${bgColor} shadow-lg transition-all hover:shadow-xl`}>
      <CardHeader
        className={`bg-gradient-to-r ${color} text-white cursor-pointer`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-white/20 p-3">{icon}</div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">{title}</CardTitle>
                <Badge className={`${badgeColor} text-xs font-bold`}>{type}</Badge>
              </div>
              <CardDescription className="text-white/80 text-sm mt-1">{description}</CardDescription>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-6 space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="p-4 bg-white rounded-lg border-l-4 border-gray-300 hover:border-gray-500 transition-colors">
              <h4 className="font-semibold text-slate-900">{item.name}</h4>
              <p className="text-sm text-slate-600 mt-1">{item.description}</p>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}

export function HomePage({ onEnterShop, onOpenAbout }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Model-Driven Architecture</p>
              <h1 className="text-4xl font-bold text-white mt-1">Online Shopping Domain</h1>
              <p className="mt-2 max-w-2xl text-slate-300">
                Complete domain model with core, supporting, and generic subdomains
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onOpenAbout} className="border-slate-600 text-slate-200 hover:bg-slate-800">
                About Company
              </Button>
              <Button onClick={onEnterShop} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                Enter Shop
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Main Domain */}
        <section className="mb-16">
          <Card className="border-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <Boxes className="absolute top-4 right-4 h-32 w-32" />
            </div>
            <CardHeader className="relative z-10">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
                  <Package className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-4xl font-bold">{domainStructure.mainDomain.name}</CardTitle>
                  <CardDescription className="text-white/90 text-base mt-2">
                    {domainStructure.mainDomain.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-3">
                <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  🛛 Customer Experience
                </Badge>
                <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  💳 Revenue & Settlement
                </Badge>
                <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-sm px-4 py-2 text-sm">
                  ⚙️ Operational Control
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Subdomains Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Subdomain Breakdown</h2>
            <p className="text-slate-400">Click on each card to expand and view detailed capabilities</p>
          </div>

          <div className="space-y-6">
            {/* Core Subdomains */}
            <ExpandableSubdomainCard
              title={domainStructure.subdomains.core.title}
              type={domainStructure.subdomains.core.type}
              description={domainStructure.subdomains.core.description}
              items={domainStructure.subdomains.core.items}
              color={domainStructure.subdomains.core.color}
              bgColor={domainStructure.subdomains.core.bgColor}
              borderColor={domainStructure.subdomains.core.borderColor}
              badgeColor={domainStructure.subdomains.core.badgeColor}
              icon={domainStructure.subdomains.core.icon}
            />

            {/* Supporting Subdomains */}
            <ExpandableSubdomainCard
              title={domainStructure.subdomains.supporting.title}
              type={domainStructure.subdomains.supporting.type}
              description={domainStructure.subdomains.supporting.description}
              items={domainStructure.subdomains.supporting.items}
              color={domainStructure.subdomains.supporting.color}
              bgColor={domainStructure.subdomains.supporting.bgColor}
              borderColor={domainStructure.subdomains.supporting.borderColor}
              badgeColor={domainStructure.subdomains.supporting.badgeColor}
              icon={domainStructure.subdomains.supporting.icon}
            />

            {/* Generic Subdomains */}
            <ExpandableSubdomainCard
              title={domainStructure.subdomains.generic.title}
              type={domainStructure.subdomains.generic.type}
              description={domainStructure.subdomains.generic.description}
              items={domainStructure.subdomains.generic.items}
              color={domainStructure.subdomains.generic.color}
              bgColor={domainStructure.subdomains.generic.bgColor}
              borderColor={domainStructure.subdomains.generic.borderColor}
              badgeColor={domainStructure.subdomains.generic.badgeColor}
              icon={domainStructure.subdomains.generic.icon}
            />
          </div>
        </section>

        {/* Footer Info */}
        <section className="mt-16 p-8 rounded-lg bg-slate-800/50 border border-slate-700">
          <h3 className="text-xl font-bold text-white mb-4">Domain Model Overview</h3>
          <div className="grid md:grid-cols-3 gap-6 text-slate-300 text-sm">
            <div>
              <p className="font-semibold text-cyan-400 mb-2">🎯 Core: The Heart</p>
              <p>Checkout and payment orchestration—directly generating revenue and customer value.</p>
            </div>
            <div>
              <p className="font-semibold text-emerald-400 mb-2">🔧 Supporting: The Enablers</p>
              <p>Catalog, reviews, and admin operations—make the core work smoothly.</p>
            </div>
            <div>
              <p className="font-semibold text-amber-400 mb-2">🔐 Generic: The Utilities</p>
              <p>Auth, email, storage, UI—reusable commodity components found in most systems.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage
