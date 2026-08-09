import { NextResponse } from "next/server";

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="8" fill="#0F172A"/>
  <path d="M16 5L24 8V14C24 19.5 20.5 24.5 16 26C11.5 24.5 8 19.5 8 14V8L16 5Z" fill="#0D9488"/>
  <path d="M16 10.5V17.5M12.5 14H19.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
