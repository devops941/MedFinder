import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Store from '@/models/Store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, address, city, pincode, ownerEmail, medicines, imageUrl } = body;

    if (!name || !address || !city || !pincode || !ownerEmail) {
      return NextResponse.json(
        { success: false, message: 'Store Name, Address, City, Pincode, and Owner Email are required.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if store name or address already exists for this owner
    const existingStore = await Store.findOne({ name, ownerEmail });
    if (existingStore) {
      return NextResponse.json(
        { success: false, message: 'You already have a pharmacy registered with this name.' },
        { status: 409 }
      );
    }

    // Create the new store
    const newStore = await Store.create({
      name,
      address,
      city,
      pincode,
      ownerEmail,
      imageUrl,
      medicines: medicines || []
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Store registered successfully!',
        data: {
          store: newStore
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Store registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while registering store.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ownerEmail = searchParams.get('email');

    await connectToDatabase();

    const query = ownerEmail ? { ownerEmail } : {};
    const stores = await Store.find(query);

    return NextResponse.json(
      { success: true, data: stores },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
