'use client'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'



if (typeof window !== 'undefined') {
    const originalError = console.error;
    console.error = (...args) => {
        if (
            args[0] &&
            (
                (typeof args[0] === 'string' && (args[0].includes('AbortError') || args[0].includes('The operation was aborted'))) ||
                args[0].name === 'AbortError' ||
                (args[0].message && args[0].message.includes('The operation was aborted'))
            )
        ) {
            return;
        }
        originalError(...args);
    };

    window.addEventListener('unhandledrejection', (event) => {
        if (event.reason && (event.reason.name === 'AbortError' || event.reason.message?.includes('The operation was aborted'))) {
            event.preventDefault(); // Stop the Next.js Turbopack overlay
        }
    });
}


export function PHProvider({ children }) {
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_POSTHOG_TOKEN) {
        return <>{children}</>
    }
    return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
