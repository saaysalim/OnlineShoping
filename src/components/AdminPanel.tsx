import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { toast } from 'sonner@2.0.3'
import { isValidIBAN } from '../utils/iban'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { uploadImageFile } from '../utils/images'

interface AdminPanelProps {
  onAddProduct: (product: {
    name: string
    description: string
    price: number
    imageUrl: string
    category: string
  }) => void
}

export function AdminPanel({ onAddProduct }: AdminPanelProps) {
  const [open, setOpen] = useState(false)
  const [productForm, setProductForm] = useState<any>({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    category: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [bankAccount, setBankAccount] = useState(() => {
    try {
      const raw = localStorage.getItem('osm_bank')
      return raw ? JSON.parse(raw) : { accountName: '', iban: '', bankName: '' }
    } catch {
      return { accountName: '', iban: '', bankName: '' }
    }
  })
  const [editingBank, setEditingBank] = useState(false)

  const handleSubmit = () => {
    const submit = async () => {
      let imageUrl = productForm.imageUrl
      if (imageFile) {
        setIsUploadingImage(true)
        try {
          toast.loading('Uploading image...')
          const res = await uploadImageFile(imageFile)
          if (res?.success && res.image?.url) {
            imageUrl = res.image.url
            toast.dismiss()
            toast.success('Image uploaded successfully!')
          } else {
            toast.dismiss()
            toast.error(`Image upload failed: ${res?.error || 'Unknown error'}`)
            return
          }
        } catch (e) {
          console.error('Upload failed', e)
          toast.dismiss()
          toast.error(`Image upload failed: ${e instanceof Error ? e.message : 'Network error'}`)
          return
        } finally {
          setIsUploadingImage(false)
        }
      }

      if (productForm.name && productForm.description && productForm.price && (imageUrl || productForm.imageUrl)) {
        onAddProduct({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price),
          imageUrl: imageUrl || productForm.imageUrl,
          category: productForm.category
        })

        setProductForm({ name: '', description: '', price: '', imageUrl: '', category: '' })
        setImageFile(null)
        setPreviewUrl(null)
        setOpen(false)
        toast.success('Product added successfully!')
      } else {
        toast.error('Please provide name, description, price and an image URL or upload a file.')
      }
    }

    submit()
  }

  const handleSaveBank = () => {
    if (bankAccount.iban && !isValidIBAN(bankAccount.iban)) {
      toast.error('Invalid IBAN. Please check and try again.')
      return
    }

    localStorage.setItem('osm_bank', JSON.stringify(bankAccount))
    toast.success('Bank details saved')
    setEditingBank(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              placeholder="e.g., Irish Wool Sweater"
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              placeholder="e.g., Clothing, Food, Crafts"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Short description of the product"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="price">Price (€)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              placeholder="29.99"
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={productForm.imageUrl}
              onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
            {productForm.imageUrl && (
              <div className="mt-2">
                <img
                  src={productForm.imageUrl}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            )}
            <div className="mt-3">
              <Label htmlFor="imageFile">Or upload image</Label>
              <input
                id="imageFile"
                type="file"
                accept="image/*"
                disabled={isUploadingImage}
                onChange={(e) => {
                  const f = e.target.files?.[0] || null
                  setImageFile(f)
                  if (f) {
                    setPreviewUrl(URL.createObjectURL(f))
                    toast.success(`Selected: ${f.name}`)
                  } else {
                    setPreviewUrl(null)
                  }
                }}
                className="mt-2"
              />
              {previewUrl && (
                <div className="mt-3">
                  <div className="flex items-end gap-2">
                    <img src={previewUrl} alt="Uploaded preview" className="w-32 h-32 object-cover rounded" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImageFile(null)
                        setPreviewUrl(null)
                        const input = document.getElementById('imageFile') as HTMLInputElement
                        if (input) input.value = ''
                        toast.info('Image file cleared')
                      }}
                      disabled={isUploadingImage}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isUploadingImage}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isUploadingImage}>
              {isUploadingImage ? 'Uploading...' : 'Add Product'}
            </Button>
          </div>
        </div>

        {/* Bank account management for receiving payments */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-2">Bank account (receive funds)</h3>
          {!editingBank ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="mb-1"><strong>Account name:</strong> {bankAccount.accountName || '—'}</p>
                <p className="mb-1"><strong>IBAN:</strong> {bankAccount.iban || '—'}</p>
                <p className="mb-1"><strong>Bank:</strong> {bankAccount.bankName || '—'}</p>
              </div>
              <div>
                <Button variant="outline" onClick={() => setEditingBank(true)}>Edit</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <Label htmlFor="acctName">Account name</Label>
                <Input id="acctName" value={bankAccount.accountName} onChange={(e) => setBankAccount({ ...bankAccount, accountName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="iban">IBAN</Label>
                <Input id="iban" value={bankAccount.iban} onChange={(e) => setBankAccount({ ...bankAccount, iban: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="bankName">Bank name</Label>
                <Input id="bankName" value={bankAccount.bankName} onChange={(e) => setBankAccount({ ...bankAccount, bankName: e.target.value })} />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditingBank(false)}>Cancel</Button>
                <Button onClick={handleSaveBank}>Save</Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
