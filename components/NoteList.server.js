import React from 'react'
import { fetch } from 'react-fetch'

import SidebarNote from './SidebarNote'

// const endpoint = process.env.ENDPOINT
const endpoint = 'https://next-server-components-git-fauna.vercel.vercel.app'

export default function NoteList({ searchText }) {
  const notes = fetch(endpoint + '/api/notes').json()

  return notes.length > 0 ? (
    <ul className="notes-list">
      {notes.map(note =>
        note &&
        (!searchText ||
          note.title.toLowerCase().includes(searchText.toLowerCase())) ? (
          <li key={note.id}>
            <SidebarNote note={note} />
          </li>
        ) : null
      )}
    </ul>
  ) : (
    <div className="notes-empty">
      {searchText
        ? `Couldn't find any notes titled "${searchText}".`
        : 'No notes created yet!'}{' '}
    </div>
  )
}
