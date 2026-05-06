import mongoose from 'mongoose';

const TrainingSchema = new mongoose.Schema({
  facultyName: {
    type: String,
    required: [true, 'Faculty Name is required'],
  },
  companyName: {
    type: String,
    required: [true, 'Company Name is required'],
  },
  type: {
    type: String,
    enum: ['Internship', 'Training'],
    required: [true, 'Training Type is required'],
  },
  trainingName: {
    type: String,
    required: [true, 'Training Name is required'],
  },
  technology: {
    type: String,
    required: [true, 'Technology is required'],
  },
  trainerName: {
    type: String,
    required: [true, 'Trainer Name is required'],
  },
  totalDays: {
    type: Number,
    required: [true, 'Total Days is required'],
  },
  fromDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  toDate: {
    type: Date,
    required: [true, 'End date is required'],
  },
  proofUrl: {
    type: String,
    required: [true, 'Proof URL is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Training || mongoose.model('Training', TrainingSchema);
