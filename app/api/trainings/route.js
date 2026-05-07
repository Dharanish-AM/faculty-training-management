import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Training from '@/models/Training';

export async function POST(req) {
  try {
    await connectDB();
    const data = await req.json();
    
    if (!data.proofUrl) {
      return NextResponse.json({ error: 'Proof file URL is required' }, { status: 400 });
    }

    const trainingData = {
      facultyName: data.facultyName,
      companyName: data.companyName,
      type: data.type,
      trainingName: data.trainingName,
      technology: data.technology,
      trainerName: data.trainerName,
      totalDays: Number(data.totalDays),
      fromDate: new Date(data.fromDate),
      toDate: new Date(data.toDate),
      proofUrl: data.proofUrl,
    };

    const newTraining = await Training.create(trainingData);
    return NextResponse.json(newTraining, { status: 201 });
  } catch (error) {
    console.error('Error creating training:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    
    const query = search ? {
      $or: [
        { facultyName: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
      ]
    } : {};

    const trainings = await Training.find(query).sort({ createdAt: -1 });
    return NextResponse.json(trainings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
