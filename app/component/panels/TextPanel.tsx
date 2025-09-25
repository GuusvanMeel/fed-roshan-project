import React from 'react'

export default function TextPanel({ Text }: { Text: string}) {
  return (
    <div className="bg-blue-200 p-4 rounded">{Text}</div>

  )
}
