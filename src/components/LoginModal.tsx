import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'

interface LoginModalProps {
  onLogin: (user: { username: string; role: 'admin' | 'user' }) => void
  onLogout: () => void
  currentUser?: { username: string; role: 'admin' | 'user' } | null
}

export function LoginModal({ onLogin, onLogout, currentUser }: LoginModalProps) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Simple client-side auth for demo purposes only
    if (username === 'admin' && password === 'admin123') {
      const user = { username: 'admin', role: 'admin' as const }
      localStorage.setItem('osm_user', JSON.stringify(user))
      onLogin(user)
      setOpen(false)
      return
    }

    const user = { username, role: 'user' as const }
    localStorage.setItem('osm_user', JSON.stringify(user))
    onLogin(user)
    setOpen(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('osm_user')
    onLogout()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {currentUser ? (
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Logout ({currentUser.username})
          </Button>
        ) : (
          <Button variant="outline" size="sm">Login</Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="login-username">Username</Label>
            <Input id="login-username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div>
            <Label htmlFor="login-password">Password</Label>
            <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleLogin}>Sign In</Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Tip: Sign in as admin with <strong>admin / admin123</strong> to access admin features.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LoginModal
