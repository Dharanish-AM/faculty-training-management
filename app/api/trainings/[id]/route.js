import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Training from '@/models/Training';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const training = await Training.findById(id);
    if (!training) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json(training);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const updatedTraining = await Training.findByIdAndUpdate(id, body, { new: true });
    if (!updatedTraining) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTraining);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deletedTraining = await Training.findByIdAndDelete(id);
    if (!deletedTraining) {
      return NextResponse.json({ error: 'Training not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Training deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
