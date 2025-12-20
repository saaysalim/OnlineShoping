import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { toast } from 'sonner@2.0.3'
import { isValidIBAN } from '../utils/iban'

export function BankSettings() {
  const [open, setOpen] = useState(false)
  const [bank, setBank] = useState(() => {
    try {
      const raw = localStorage.getItem('osm_bank')
      return raw ? JSON.parse(raw) : { accountName: '', iban: '', bankName: '' }
    } catch {
      return { accountName: '', iban: '', bankName: '' }
    }
  })

  const handleSave = () => {
    // validate IBAN before saving
    if (bank.iban && !isValidIBAN(bank.iban)) {
      toast.error('Invalid IBAN. Please check and try again.')
      return
    }

    localStorage.setItem('osm_bank', JSON.stringify(bank))
    toast.success('Bank details saved')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Bank Settings</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Bank Account Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="acct">Account name</Label>
            <Input id="acct" value={bank.accountName} onChange={(e) => setBank({ ...bank, accountName: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="iban">IBAN</Label>
            <Input id="iban" value={bank.iban} onChange={(e) => setBank({ ...bank, iban: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="bankName">Bank name</Label>
            <Input id="bankName" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default BankSettings
