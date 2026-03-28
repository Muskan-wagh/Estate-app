'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_TOKEN) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_TOKEN, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'always',
    })
}

export function PHProvider({ children }) {
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_POSTHOG_TOKEN) {
        return <>{children}</>
    }
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
