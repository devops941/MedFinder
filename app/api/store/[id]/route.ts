import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Store from '@/models/Store';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const store = await Store.findById(id);
    
    if (!store) {
      return NextResponse.json(
        { success: false, message: 'Store not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, data: store },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in GET /api/store/[id]:", error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch store details: ' + (error.message || String(error)) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, address, city, pincode, medicines, imageUrl } = body;
    
    await connectToDatabase();
    
    const updatedStore = await Store.findByIdAndUpdate(
      id,
      {
        name,
        address,
        city,
        pincode,
        imageUrl,
        medicines: medicines || []
      },
      { new: true } // Returns the updated document
    );
    
    if (!updatedStore) {
      return NextResponse.json(
        { success: false, message: 'Store not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Store updated successfully', data: updatedStore },
      { status: 200 }
    );
  } catch (error) {
    console.error('Store update error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while updating store' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    
    const deletedStore = await Store.findByIdAndDelete(id);
    
    if (!deletedStore) {
      return NextResponse.json(
        { success: false, message: 'Store not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { success: true, message: 'Store deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Store delete error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error while deleting store' },
      { status: 500 }
    );
  }
}
