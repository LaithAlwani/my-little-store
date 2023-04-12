import React from 'react'
import { Link } from 'react-router-dom'

export default function Store({store}) {
  return (
    <Link to={`${store.id}`} className='bg-container'>
      <h3>{store.name}</h3>
    </Link>
  )
}
