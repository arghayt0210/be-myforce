import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Only rewrite API requests
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const url = new URL(request.url)
    const targetUrl = new URL(process.env.NEXT_PUBLIC_API_URL!)
    
    // Remove /api prefix for the backend
    url.pathname = url.pathname.replace(/^\/api/, '')
    
    return NextResponse.rewrite(new URL(url.pathname + url.search, targetUrl))
  }
}
 
export const config = {
  matcher: '/api/:path*',
}