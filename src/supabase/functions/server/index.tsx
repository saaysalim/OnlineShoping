import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import * as kv from './kv_store.tsx'
import { createClient } from 'jsr:@supabase/supabase-js@2.49.8'

const app = new Hono()

app.use('*', cors())
app.use('*', logger(console.log))

// Product endpoints
app.post('/make-server-f3a661bc/products', async (c) => {
  try {
    const product = await c.req.json()
    const productId = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const productData = {
      id: productId,
      ...product,
      createdAt: new Date().toISOString(),
      reviews: []
    }
    
    await kv.set(`products:${productId}`, productData)
    
    // Add to products list
    const productsList = await kv.get('products:list') || []
    productsList.push(productId)
    await kv.set('products:list', productsList)
    
    return c.json({ success: true, product: productData })
  } catch (error) {
    console.log(`Error creating product: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.get('/make-server-f3a661bc/products', async (c) => {
  try {
    const productsList = await kv.get('products:list') || []
    const products = []
    
    for (const productId of productsList) {
      const product = await kv.get(`products:${productId}`)
      if (product) {
        products.push(product)
      }
    }
    
    return c.json({ success: true, products })
  } catch (error) {
    console.log(`Error fetching products: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.get('/make-server-f3a661bc/products/:id', async (c) => {
  try {
    const productId = c.req.param('id')
    const product = await kv.get(`products:${productId}`)
    
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404)
    }
    
    // Fetch reviews for this product
    const reviewsData = await kv.getByPrefix(`reviews:${productId}:`)
    const reviews = reviewsData || []
    
    return c.json({ success: true, product: { ...product, reviews } })
  } catch (error) {
    console.log(`Error fetching product ${c.req.param('id')}: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Review endpoints
app.post('/make-server-f3a661bc/reviews', async (c) => {
  try {
    const { productId, customerName, rating, comment } = await c.req.json()
    
    const reviewId = `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const review = {
      id: reviewId,
      productId,
      customerName,
      rating,
      comment,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`reviews:${productId}:${reviewId}`, review)
    
    return c.json({ success: true, review })
  } catch (error) {
    console.log(`Error creating review: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Cart endpoints
app.get('/make-server-f3a661bc/cart/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const cart = await kv.get(`cart:${userId}`) || { items: [] }
    
    return c.json({ success: true, cart })
  } catch (error) {
    console.log(`Error fetching cart for user ${c.req.param('userId')}: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.post('/make-server-f3a661bc/cart/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const { productId, quantity } = await c.req.json()
    
    const product = await kv.get(`products:${productId}`)
    if (!product) {
      return c.json({ success: false, error: 'Product not found' }, 404)
    }
    
    let cart = await kv.get(`cart:${userId}`) || { items: [] }
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex((item: any) => item.productId === productId)
    
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity
    } else {
      cart.items.push({
        productId,
        product,
        quantity,
        addedAt: new Date().toISOString()
      })
    }
    
    await kv.set(`cart:${userId}`, cart)
    
    return c.json({ success: true, cart })
  } catch (error) {
    console.log(`Error adding to cart for user ${c.req.param('userId')}: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.delete('/make-server-f3a661bc/cart/:userId/:productId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const productId = c.req.param('productId')
    
    let cart = await kv.get(`cart:${userId}`) || { items: [] }
    cart.items = cart.items.filter((item: any) => item.productId !== productId)
    
    await kv.set(`cart:${userId}`, cart)
    
    return c.json({ success: true, cart })
  } catch (error) {
    console.log(`Error removing from cart for user ${c.req.param('userId')}: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.put('/make-server-f3a661bc/cart/:userId/:productId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const productId = c.req.param('productId')
    const { quantity } = await c.req.json()
    
    let cart = await kv.get(`cart:${userId}`) || { items: [] }
    const itemIndex = cart.items.findIndex((item: any) => item.productId === productId)
    
    if (itemIndex >= 0) {
      cart.items[itemIndex].quantity = quantity
    }
    
    await kv.set(`cart:${userId}`, cart)
    
    return c.json({ success: true, cart })
  } catch (error) {
    console.log(`Error updating cart quantity for user ${c.req.param('userId')}: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

// Order endpoints
app.post('/make-server-f3a661bc/orders', async (c) => {
  try {
    const orderData = await c.req.json()
    const orderId = `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    // determine status: bank transfers are pending, others are paid
    const status = orderData.paymentMethod === 'bank-transfer' ? 'pending' : 'paid'

    const order = {
      id: orderId,
      ...orderData,
      status,
      createdAt: new Date().toISOString()
    }
    
    await kv.set(`orders:${orderId}`, order)
    
    // Clear the user's cart
    if (orderData.userId) {
      await kv.set(`cart:${orderData.userId}`, { items: [] })
    }
    
    // attempt to send confirmation email if email provided
    let emailSent = false
    try {
      const to = orderData?.billingInfo?.email
      if (to) {
        const subject = `Order confirmation - ${orderId}`
        const text = `Thank you for your order.\n\nOrder ID: ${orderId}\nTotal: ${order.total || ''}\nStatus: ${order.status}\n\nItems:\n${(order.items || []).map((it: any) => `- ${it.product.name} x${it.quantity}`).join('\n')}`

        const mailgunKey = Deno.env.get('MAILGUN_API_KEY')
        const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN')
        const mailFrom = Deno.env.get('MAIL_FROM') || `no-reply@${mailgunDomain || 'example.com'}`

        if (mailgunKey && mailgunDomain) {
          const form = new FormData()
          form.append('from', mailFrom)
          form.append('to', to)
          form.append('subject', subject)
          form.append('text', text)

          const mgRes = await fetch(`https://api.mailgun.net/v3/${mailgunDomain}/messages`, {
            method: 'POST',
            headers: {
              Authorization: `Basic ${btoa(`api:${mailgunKey}`)}`
            },
            body: form
          })

          if (mgRes.ok) {
            emailSent = true
          } else {
            console.log('Mailgun send failed', await mgRes.text())
          }
        } else {
          // fallback: store email content in KV store for admin review
          const emailId = `email-${Date.now()}-${Math.random().toString(36).substr(2,9)}`
          await kv.set(`emails:${emailId}`, { id: emailId, to, subject, text, createdAt: new Date().toISOString() })
          const list = (await kv.get('emails:list')) || []
          list.push(emailId)
          await kv.set('emails:list', list)
          console.log('Mail service not configured; saved confirmation email to KV store', emailId)
        }
      }
    } catch (e) {
      console.log('Error sending confirmation email', e)
    }

    return c.json({ success: true, order, emailSent })
  } catch (error) {
    console.log(`Error creating order: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.get('/make-server-f3a661bc/orders/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const allOrders = await kv.getByPrefix('orders:')
    
    const userOrders = (allOrders || []).filter((order: any) => order.userId === userId)
    
    return c.json({ success: true, orders: userOrders })
  } catch (error) {
    console.log(`Error fetching orders for user ${c.req.param('userId')}: ${error}`)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

Deno.serve(app.fetch)

// Image storage endpoints
// POST /make-server-f3a661bc/images  -> { filename, contentBase64 }
// GET  /make-server-f3a661bc/images  -> list images metadata

const supabase = createClient(Deno.env.get('SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))

app.post('/make-server-f3a661bc/images', async (c) => {
  try {
    const body = await c.req.json()
    const { filename, contentBase64 } = body
    if (!filename || !contentBase64) {
      return c.json({ success: false, error: 'filename and contentBase64 required' }, 400)
    }

    // convert base64 to Uint8Array
    const binaryString = atob(contentBase64)
    const len = binaryString.length
    const bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    const bucket = 'pictures'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2,10)}-${filename}`
    const uploadResult = await supabase.storage.from(bucket).upload(path, bytes, { upsert: false })
    if (uploadResult.error) {
      console.log('Upload error', uploadResult.error)
      return c.json({ success: false, error: uploadResult.error.message }, 500)
    }

    const publicUrl = supabase.storage.from(bucket).getPublicUrl(path).data?.publicUrl

    const id = `image-${Date.now()}-${Math.random().toString(36).substr(2,9)}`
    const meta = { id, filename, path, url: publicUrl, createdAt: new Date().toISOString() }

    await kv.set(`images:${id}`, meta)
    const list = (await kv.get('images:list')) || []
    list.push(id)
    await kv.set('images:list', list)

    return c.json({ success: true, image: meta })
  } catch (error) {
    console.log('Error uploading image', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})

app.get('/make-server-f3a661bc/images', async (c) => {
  try {
    const list = (await kv.get('images:list')) || []
    const images = []
    for (const id of list) {
      const meta = await kv.get(`images:${id}`)
      if (meta) images.push(meta)
    }
    return c.json({ success: true, images })
  } catch (error) {
    console.log('Error fetching images', error)
    return c.json({ success: false, error: String(error) }, 500)
  }
})
