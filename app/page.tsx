'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        window.location.href = '/dashboard'
      }
    })
  }, [])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <button
        onClick={signIn}
        className="px-6 py-3 bg-black text-white rounded"
      >
        Sign in with Google
      </button>
    </main>
  )
}