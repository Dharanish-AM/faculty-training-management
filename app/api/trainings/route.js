import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Training from '@/models/Training';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    
    const file = formData.get('proof');
    if (!file) {
      return NextResponse.json({ error: 'Proof file is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const cloudinaryResponse = await uploadToCloudinary(buffer, file.name);

    const trainingData = {
      facultyName: formData.get('facultyName'),
      companyName: formData.get('companyName'),
      type: formData.get('type'),
      trainingName: formData.get('trainingName'),
      technology: formData.get('technology'),
      trainerName: formData.get('trainerName'),
      totalDays: Number(formData.get('totalDays')),
      fromDate: new Date(formData.get('fromDate')),
      toDate: new Date(formData.get('toDate')),
      proofUrl: cloudinaryResponse.secure_url,
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
