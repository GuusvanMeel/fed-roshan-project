import React from 'react'

export default function ImagePanel({ source }: { source: string}) {
return (
    <img
        src={source}
        alt=""
        className="rounded w-full h-full object-cover"
    />
)
}

