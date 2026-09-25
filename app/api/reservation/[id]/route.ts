import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Reservation from '@/models/Reservation';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    await connectToDatabase();
    
    const updatedReservation = await Reservation.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    
    if (!updatedReservation) {
      return NextResponse.json({ success: false, message: 'Reservation not found' }, { status: 404 });
    }
    
    return NextResponse.json(
      { success: true, message: 'Reservation updated', data: updatedReservation },
      { status: 200 }
    );
  } catch (error) {
    console.error('Reservation update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
