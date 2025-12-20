import { useState, useEffect } from 'react'
import { CreditCard, ArrowLeft, Check } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Separator } from './ui/separator'
import { toast } from 'sonner@2.0.3'
import { createCheckoutSession, getCheckoutSession } from '../utils/payments'

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

interface CheckoutPageProps {
  cart: { items: CartItem[] }
  onBack: () => void
  onPlaceOrder: (orderData: any) => Promise<any>
}

export function CheckoutPage({ cart, onBack, onPlaceOrder }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('visa')
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [emailSent, setEmailSent] = useState<boolean | null>(null)
  const [bankAccount, setBankAccount] = useState<{ accountName?: string; iban?: string; bankName?: string }>({})
  const [bankReference, setBankReference] = useState<string | null>(null)

  const [billingInfo, setBillingInfo] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })

  const total = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Bank transfer flow: validate bank details and show instructions
    if (paymentMethod === 'bank-transfer') {
      if (!bankAccount || !bankAccount.iban || !bankAccount.accountName) {
        toast.error('No bank account configured. Contact the seller or use a different payment method.')
        setIsProcessing(false)
        return
      }

      const reference = `ORDER-${Date.now()}`
      setBankReference(reference)

      const orderData = {
        userId: 'guest-user',
        items: cart.items,
        total,
        billingInfo,
        paymentMethod: 'bank-transfer',
        paymentReference: reference,
        shippingAddress: {
          address: billingInfo.address,
          city: billingInfo.city,
          postalCode: billingInfo.postalCode,
          country: 'Ireland'
        }
      }

      try {
        const res = await onPlaceOrder(orderData)
        setEmailSent(res?.emailSent ?? false)
      } catch (e) {
        console.error('Order placement error', e)
      }

      setIsProcessing(false)
      setOrderComplete(true)
      return
    }

    // Card / wallet via Stripe Checkout
    try {
      const returnBase = `${window.location.origin}${window.location.pathname}`
      const items = cart.items.map((it) => ({
        name: it.product.name,
        // amount in cents
        amount: Math.round(it.product.price * 100),
        quantity: it.quantity,
        image: it.product.imageUrl
      }))

      // Store pending order locally to finalize after successful payment
      const pendingOrder = {
        userId: 'guest-user',
        items: cart.items,
        total,
        billingInfo,
        paymentMethod,
        shippingAddress: {
          address: billingInfo.address,
          city: billingInfo.city,
          postalCode: billingInfo.postalCode,
          country: 'Ireland'
        }
      }
      localStorage.setItem('osm_pending_order', JSON.stringify(pendingOrder))

      const res = await createCheckoutSession({
        items,
        customerEmail: billingInfo.email || undefined,
        successUrl: returnBase,
        cancelUrl: returnBase
      })

      if (res?.success && res?.url) {
        window.location.href = res.url
        return
      }
      throw new Error(res?.error || 'Unable to start payment')
    } catch (e: any) {
      console.error('Payment error', e)
      toast.error(e?.message || 'Payment could not be initiated')
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem('osm_bank')
      if (raw) setBankAccount(JSON.parse(raw))
    } catch {
      setBankAccount({})
    }
    // On return from Stripe
    const params = new URLSearchParams(window.location.search)
    const checkoutResult = params.get('checkout')
    const sessionId = params.get('session_id')
    if (checkoutResult === 'success') {
      (async () => {
        try {
          setIsProcessing(true)
          // verify session if available
          if (sessionId) {
            const verify = await getCheckoutSession(sessionId)
            if (!verify?.success) {
              toast.warning('Payment verified but status unavailable')
            }
          }
          const rawPending = localStorage.getItem('osm_pending_order')
          if (rawPending) {
            const orderData = JSON.parse(rawPending)
            const res = await onPlaceOrder(orderData)
            setEmailSent(res?.emailSent ?? false)
            localStorage.removeItem('osm_pending_order')
          }
          setOrderComplete(true)
        } catch (e) {
          console.error('Finalize order error', e)
          toast.error('Payment succeeded but order finalization failed')
        } finally {
          setIsProcessing(false)
        }
      })()
    } else if (checkoutResult === 'cancel') {
      toast.info('Payment cancelled')
      localStorage.removeItem('osm_pending_order')
    }
  }, [])

  if (orderComplete) {
    if (paymentMethod === 'bank-transfer') {
      return (
        <div className="max-w-2xl mx-auto py-12 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="mb-2">Order Recorded — Bank Transfer Pending</h2>
          <p className="text-muted-foreground mb-4">Your order has been recorded. Please transfer the total amount to the bank account below and include the payment reference.</p>

          <div className="bg-card p-4 rounded-md text-left mb-4 max-w-md mx-auto">
            <p className="mb-1"><strong>Account name:</strong> {bankAccount.accountName || '—'}</p>
            <p className="mb-1"><strong>IBAN:</strong> {bankAccount.iban || '—'}</p>
            <p className="mb-1"><strong>Bank:</strong> {bankAccount.bankName || '—'}</p>
            <p className="mt-2"><strong>Reference:</strong> {bankReference}</p>
            <p className="mt-2 text-sm text-muted-foreground">Amount: €{total.toFixed(2)}</p>
          </div>

          <p className="text-sm text-muted-foreground mb-6">Once we receive your payment the order will be processed and dispatched.</p>
            {emailSent === false && (
              <p className="text-sm text-red-600 mb-2">Confirmation email could not be sent; admin will receive the saved message.</p>
            )}
            {emailSent === true && (
              <p className="text-sm text-green-600 mb-2">A confirmation email has been sent to {billingInfo.email}.</p>
            )}
            <Button onClick={onBack}>Continue Shopping</Button>
        </div>
      )
    }

    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="mb-2">Order Placed Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. You will receive a confirmation email shortly.
        </p>
        {emailSent === false && (
          <p className="text-sm text-red-600 mb-4">We couldn't send the confirmation email; we'll retry or admin will contact you.</p>
        )}
        {emailSent === true && (
          <p className="text-sm text-green-600 mb-4">A confirmation email was sent to {billingInfo.email}.</p>
        )}
        <Button onClick={onBack}>
          Continue Shopping
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shopping
      </Button>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={billingInfo.fullName}
                    onChange={(e) => setBillingInfo({ ...billingInfo, fullName: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({ ...billingInfo, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                    placeholder="Dublin"
                  />
                </div>

                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={billingInfo.postalCode}
                    onChange={(e) => setBillingInfo({ ...billingInfo, postalCode: e.target.value })}
                    placeholder="D01 F5P2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2 p-3 border rounded">
                  <RadioGroupItem value="visa" id="visa" />
                  <Label htmlFor="visa" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Visa
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded">
                  <RadioGroupItem value="mastercard" id="mastercard" />
                  <Label htmlFor="mastercard" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Mastercard
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Credit Card
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded">
                  <RadioGroupItem value="apple-pay" id="apple-pay" />
                  <Label htmlFor="apple-pay" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🍎</span>
                      Apple Pay
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-3 border rounded">
                  <RadioGroupItem value="google-pay" id="google-pay" />
                  <Label htmlFor="google-pay" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">G</span>
                      Google Pay
                    </div>
                  </Label>
                </div>

              <div className="flex items-center space-x-2 p-3 border rounded">
                <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏦</span>
                    Bank Transfer
                  </div>
                </Label>
              </div>
              </RadioGroup>

              {/* show bank info inline when bank-transfer selected */}
              {paymentMethod === 'bank-transfer' && (!bankAccount || !bankAccount.iban || !bankAccount.accountName) && (
                <div className="p-3 mt-3 border rounded bg-yellow-50 text-sm text-yellow-800">
                  Bank account not configured by seller. Admins must set bank details in <strong>Bank Settings</strong> before bank transfer payments will work.
                </div>
              )}

              {['visa', 'mastercard', 'credit-card'].includes(paymentMethod) && (
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      value={billingInfo.cardNumber}
                      onChange={(e) => setBillingInfo({ ...billingInfo, cardNumber: e.target.value })}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        value={billingInfo.expiryDate}
                        onChange={(e) => setBillingInfo({ ...billingInfo, expiryDate: e.target.value })}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        value={billingInfo.cvv}
                        onChange={(e) => setBillingInfo({ ...billingInfo, cvv: e.target.value })}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-sm">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
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
                onClick={handlePlaceOrder} 
                className="w-full" 
                size="lg"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                This is a demo checkout. No real card payment will be processed. For bank transfer, follow the instructions after placing the order.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
