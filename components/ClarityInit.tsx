'use client'

import { useEffect } from 'react'
import clarity from '@microsoft/clarity'

const CLARITY_ID = 'yrjwdw1qky'
const PROD_HOSTNAME = 'eatbit.in'

export default function ClarityInit() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Only run on production — never on localhost, Netlify previews, or staging
    if (window.location.hostname !== PROD_HOSTNAME) return;
    clarity.init(CLARITY_ID)
  }, [])

  return null
}
