import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Training from '@/models/Training';

export async function POST(req) {
  try {
    await connectDB();
    
    // Create some realistic dummy data
    const seedData = [
      {
        facultyName: 'Dr. Alan Turing',
        companyName: 'Bletchley Park',
        type: 'Internship',
        trainingName: 'Cryptography and Cryptanalysis',
        technology: 'Mathematics, Computing',
        trainerName: 'Hugh Alexander',
        totalDays: 45,
        fromDate: new Date('2023-01-10'),
        toDate: new Date('2023-02-24'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
      {
        facultyName: 'Prof. Marie Curie',
        companyName: 'University of Paris',
        type: 'Training',
        trainingName: 'Advanced Radiation Physics',
        technology: 'Physics',
        trainerName: 'Henri Becquerel',
        totalDays: 14,
        fromDate: new Date('2023-03-05'),
        toDate: new Date('2023-03-19'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
      {
        facultyName: 'Dr. Grace Hopper',
        companyName: 'US Navy',
        type: 'Internship',
        trainingName: 'Compiler Design Bootcamp',
        technology: 'COBOL',
        trainerName: 'Howard Aiken',
        totalDays: 60,
        fromDate: new Date('2023-04-01'),
        toDate: new Date('2023-05-30'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
      {
        facultyName: 'Ada Lovelace',
        companyName: 'London Institute',
        type: 'Training',
        trainingName: 'Analytical Engine Programming',
        technology: 'Algorithm Design',
        trainerName: 'Charles Babbage',
        totalDays: 10,
        fromDate: new Date('2023-06-15'),
        toDate: new Date('2023-06-25'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
      {
        facultyName: 'Dr. John von Neumann',
        companyName: 'Institute for Advanced Study',
        type: 'Training',
        trainingName: 'Game Theory and Architecture',
        technology: 'Computer Architecture',
        trainerName: 'Self',
        totalDays: 5,
        fromDate: new Date('2023-07-10'),
        toDate: new Date('2023-07-15'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
      {
        facultyName: 'Margaret Hamilton',
        companyName: 'MIT Instrumentation Lab',
        type: 'Internship',
        trainingName: 'Apollo Flight Software Development',
        technology: 'Assembly',
        trainerName: 'Hal Laning',
        totalDays: 90,
        fromDate: new Date('2023-08-01'),
        toDate: new Date('2023-10-29'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
      {
        facultyName: 'Tim Berners-Lee',
        companyName: 'CERN',
        type: 'Training',
        trainingName: 'Hypertext Systems Masterclass',
        technology: 'HTML, HTTP',
        trainerName: 'Robert Cailliau',
        totalDays: 7,
        fromDate: new Date('2023-11-05'),
        toDate: new Date('2023-11-12'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      },
      {
        facultyName: 'Linus Torvalds',
        companyName: 'University of Helsinki',
        type: 'Training',
        trainingName: 'Kernel Development Workshop',
        technology: 'C, OS Design',
        trainerName: 'Andrew Tanenbaum',
        totalDays: 21,
        fromDate: new Date('2023-12-01'),
        toDate: new Date('2023-12-22'),
        proofUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      }
    ];

    await Training.insertMany(seedData);

    return NextResponse.json({ message: 'Database seeded successfully with 8 records.' }, { status: 201 });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json({ error: error.message || 'Failed to seed database' }, { status: 500 });
  }
}
