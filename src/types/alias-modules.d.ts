// Auto-generated module fallbacks for versioned imports used in this repo.
// These map imports like "lucide-react@0.487.0" -> the real package "lucide-react"

declare module '*@*' {
  const content: any
  export = content
}

declare module 'jsr:*' {
  const content: any
  export = content
}

// Specific re-exports (improve typing where available)
declare module 'sonner@2.0.3' {
  export * from 'sonner'
}
declare module 'lucide-react@0.487.0' {
  export * from 'lucide-react'
}
declare module 'class-variance-authority@0.7.1' {
  export * from 'class-variance-authority'
}
declare module 'react-day-picker@8.10.1' {
  export * from 'react-day-picker'
}
declare module 'react-hook-form@7.55.0' {
  export * from 'react-hook-form'
}

// Fallback for any vendor-prefixed supabase imports
declare module 'jsr:@supabase/supabase-js@*' {
  export * from '@supabase/supabase-js'
}

// Note: the broad '*@*' declaration above will catch most remaining cases and return `any`.
