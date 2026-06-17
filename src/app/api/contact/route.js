import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/connect';
import Lead from '@/lib/models/Lead';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, phone, sportOfInterest, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: { message: 'Name and phone are required.' } },
        { status: 400 }
      );
    }

    await connectDB();

    const newLead = await Lead.create({
      name,
      phone,
      sportOfInterest: sportOfInterest || undefined,
      message,
      source: 'contact-form',
      status: 'new',
    });

    return NextResponse.json({ success: true, data: newLead }, { status: 201 });
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { error: { message: 'Failed to submit form. Please try again later.' } },
      { status: 500 }
    );
  }
}
