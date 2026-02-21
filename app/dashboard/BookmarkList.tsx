'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Bookmark = {
  id: string
  title: string
  url: string
}

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])

  useEffect(() => {
    const fetchBookmarks = async () => {
      const { data } = await supabase
        .from('bookmarks')
        .select('*')
        .order('created_at', { ascending: false })

      setBookmarks(data || [])
    }

    fetchBookmarks()

    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        fetchBookmarks
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const deleteBookmark = async (id: string) => {
    await supabase.from('bookmarks').delete().eq('id', id)
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map(b => (
        <li
          key={b.id}
          className="border p-2 flex justify-between items-center"
        >
          <a
            href={b.url}
            target="_blank"
            rel="noreferrer"
            className="text-white-600"
          >
            {b.title}
          </a>
          <button onClick={() => deleteBookmark(b.id)}>❌</button>
        </li>
      ))}
    </ul>
  )
}