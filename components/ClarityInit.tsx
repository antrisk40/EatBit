'use client'

import { useEffect } from 'react'
import clarity from '@microsoft/clarity'

export default function ClarityInit() {
  useEffect(() => {
    // Check if we are running in the browser and not in development mode (optional)
    if (typeof window !== 'undefined') {
      // Initialize Microsoft Clarity with the project ID
      clarity.init('yrjwdw1qky')
    }
  }, [])

  return null
}
