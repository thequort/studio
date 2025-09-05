import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error("Admin credentials are not set in environment variables.");
      return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
    }

    if (username === adminUsername && password === adminPassword) {
      // In a real app, you would generate a secure session token here.
      // For this prototype, we'll just confirm success.
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
