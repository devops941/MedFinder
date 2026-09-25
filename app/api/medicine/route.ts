import { NextResponse } from 'next/server';

// This is your Backend API Route
export async function GET() {
  // Here you can connect to a database, fetch data, etc.
  const sampleMedicines = [
    { id: 1, name: 'Aspirin', description: 'Pain reliever and fever reducer' },
    { id: 2, name: 'Amoxicillin', description: 'Antibiotic used to treat bacterial infections' },
    { id: 3, name: 'Lisinopril', description: 'Used to treat high blood pressure' },
  ];

  // Standardized API Response
  return NextResponse.json(
    {
      success: true,
      message: 'Medicines retrieved successfully',
      data: sampleMedicines,
    },
    { status: 200 }
  );
}
