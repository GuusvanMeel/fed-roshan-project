import React from 'react'

export default function VideoPanel({ source }: { source: string}) {
  return (
    <iframe width="100%" height="100%" src={source} className="rounded" />

  )
}
