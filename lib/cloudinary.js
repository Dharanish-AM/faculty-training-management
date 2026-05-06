import { v2 as cloudinary } from 'cloudinary';

// Configure explicitly in the function to ensure process.env is ready
const getCloudinary = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  return cloudinary;
};

export const uploadToCloudinary = (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const cld = getCloudinary();
    
    // Convert buffer to data URI for traditional upload
    const base64Data = fileBuffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64Data}`; // resource_type 'auto' handles PDF too

    cld.uploader.upload(
      dataUri,
      {
        resource_type: 'auto',
        folder: 'faculty-trainings',
        public_id: fileName.replace(/\.[^/.]+$/, "") + '-' + Date.now(),
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary SDK Error:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

export default cloudinary;
