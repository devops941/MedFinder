import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, email, password, role } = body;

    if (!name || !mobile || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required (name, mobile, email, password)' },
        { status: 400 }
      );
    }

    const assignedRole = role === 'staff' ? 'staff' : 'customer';

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered' },
        { status: 409 }
      );
    }

    // Create the new user in MongoDB
    // In production, remember to hash the password before saving!
    const newUser = await User.create({
      name,
      mobile,
      email,
      password,
      role: assignedRole
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Customer registered successfully',
        data: {
          user: { _id: newUser._id, id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role, mobile: newUser.mobile },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
