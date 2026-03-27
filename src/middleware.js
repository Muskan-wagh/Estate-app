import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value, options)
                    );
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Protect Blog route - only registered users (User or Admin) can see blogs
    if (request.nextUrl.pathname.startsWith('/blog')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 2. Protect Admin route - only the person in 'admin' table can see/post blogs
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Check if user is an admin in the database
        const { data: admin, error } = await supabase
            .from('admins')
            .select('id')
            .eq('id', user.id)
            .single();

        if (error || !admin) {
            // Redirect for unauthorized access attempt
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: ['/blog/:path*', '/admin/:path*'],
};
