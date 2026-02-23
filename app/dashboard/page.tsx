export const dynamic = 'force-dynamic'
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import BookmarkForm from './BookmarkForm'
import BookmarkList from './BookmarkList'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/'
      } else {
        setUser(data.user)
      }
    })
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <div className="max-w-xl mx-auto p-6">
    <div className="flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold">My Bookmarks</h1>
      <button
        onClick={signOut}
        className="text-sm bg-[#DC143C] hover:bg-[#b11232] text-white px-3 py-1 rounded cursor-pointer"
      >
        Logout
      </button>
    </div>
    <BookmarkForm userId={user.id} />
    <BookmarkList userId={user.id} />
  </div>
  )
}