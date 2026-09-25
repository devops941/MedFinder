import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user exists in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. User not found.' },
        { status: 404 }
      );
    }

    // In a real app, compare hashed password using bcrypt here
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid password.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: { _id: user._id, id: user._id, email: user.email, name: user.name, role: user.role, mobile: user.mobile },
          token: 'simulated_jwt_token_123',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
