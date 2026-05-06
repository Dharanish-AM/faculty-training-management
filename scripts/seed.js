const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const TrainingSchema = new mongoose.Schema({
  facultyName: String,
  companyName: String,
  type: String,
  trainingName: String,
  technology: String,
  fromDate: Date,
  toDate: Date,
  trainerName: String,
  totalDays: Number,
  proofUrl: String,
  createdAt: { type: Date, default: Date.now }
});

const Training = mongoose.models.Training || mongoose.model('Training', TrainingSchema);

const facultyMembers = [
  "Dr.H.Anandakumar", "Dr.V.S.Akshaya", "Dr.S.Sampath Kumar", "Dr.S.Yasotha",
  "Dr.M.Suriya", "Dr.K.Sureshkumar", "Dr.A.Anandaraj", "Dr.Gowtham Chakravarthy",
  "Dr.S.Ananthi", "Dr.A.Sarfaraz Ahmed", "Dr.H.Summia Parveen", "Dr.S.Yuvaraj",
  "Dr.J.Sreemathy", "Dr.M.Praveen Kumar", "Dr.K.B.Sarmila", "Dr.N.Saranya",
  "Ms.T.M.Ishwarya", "Ms.V.Niranjani", "Ms.S.Saradha", "Mr.R.Giridharan",
  "Ms.M.Kalaiselvi", "Ms.N.Gayathri", "Ms.B.Gomathi", "Mr.B.Saravanan",
  "Ms.J.Keerthika", "Mr.A.Mohanraj", "Ms.D.Mohanapriya", "Mr.V.Lakshmanan",
  "Ms.K.Agalya", "Mr.M.Karthick Raja", "Ms.E.Saranya", "Ms.A.Suganyamahalakshmi",
  "Ms.M.Abinaya", "Mr.P.Arun Prakash", "Ms.N.Priyanka", "Ms.P.Anusha Devi",
  "Ms.P.V. Arunasree", "Mr.R.Kirubakaran", "Mr.K.Sabarigirivason", "Dr.Pethuru Raj",
  "Mr.V.Chandran", "Mr.A.Jeeva", "Mr.R.Vasanth Kumar"
];

const technologies = ["Artificial Intelligence", "Cloud Computing", "React & Next.js", "Cybersecurity", "Block Chain", "Data Science", "Internet of Things", "Full Stack Web Development", "Machine Learning", "Quantum Computing"];
const companies = ["Google Cloud Academy", "Microsoft Azure Training", "AWS Training Center", "IBM SkillsBuild", "Oracle University", "Adobe Education", "Cisco Networking Academy", "Infosys Springboard", "TCS iON", "Wipro TalentNext"];
const trainingNames = ["Advanced Certification Program", "Faculty Development Program", "Winter Training Workshop", "Summer Internship Program", "Skill Enhancement Session", "Corporate Excellence Program", "Research Methodology Workshop", "Technical Bootcamp", "Leadership Training", "Innovative Pedagogy Workshop"];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing existing training data...');
    await Training.deleteMany({});
    console.log('Database cleared.');

    const entries = facultyMembers.map(faculty => {
      const type = Math.random() > 0.4 ? 'Training' : 'Internship';
      const tech = technologies[Math.floor(Math.random() * technologies.length)];
      const company = companies[Math.floor(Math.random() * companies.length)];
      const title = trainingNames[Math.floor(Math.random() * trainingNames.length)];
      
      const start = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
      const days = Math.floor(Math.random() * 15) + 5;
      const end = new Date(start);
      end.setDate(start.getDate() + days);

      return {
        facultyName: faculty,
        companyName: company,
        type: type,
        trainingName: `${tech} ${title}`,
        technology: tech,
        fromDate: start,
        toDate: end,
        trainerName: "Industry Expert",
        totalDays: days + 1,
        proofUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
      };
    });

    console.log(`Seeding ${entries.length} records...`);
    await Training.insertMany(entries);
    console.log('Seeding completed successfully.');

    await mongoose.disconnect();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
}

seed();
