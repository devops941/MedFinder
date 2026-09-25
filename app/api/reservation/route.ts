import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    await connectToDatabase();
    
    const newReservation = await Reservation.create(body);
    
    return NextResponse.json(
      { success: true, message: 'Reservation created successfully', data: newReservation },
      { status: 201 }
    );
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const storeOwnerEmail = searchParams.get('storeOwnerEmail');
    const customerEmail = searchParams.get('customerEmail');
    
    await connectToDatabase();
    
    let query: any = {};
    if (storeOwnerEmail) query.storeOwnerEmail = storeOwnerEmail;
    if (customerEmail) query.customerEmail = customerEmail;

    const reservations = await Reservation.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(
      { success: true, data: reservations },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reservation fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
