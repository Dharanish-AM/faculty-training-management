import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST() {
  try {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'ADMIN_USERNAME and ADMIN_PASSWORD must be set' },
        { status: 500 }
      );
    }

    await connectDB();

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { success: true, message: 'Admin account already exists' },
        { status: 200 }
      );
    }

    const { hash, salt } = Admin.hashPassword(password);
    await Admin.create({ username, password: hash, salt });

    return NextResponse.json(
      { success: true, message: 'Admin account created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to create admin account' },
      { status: 500 }
    );
  }
}