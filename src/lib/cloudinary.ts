import { Cloudinary } from "@cloudinary/url-gen";

/**
 * TaskFlow AI Cloudinary Configuration
 * Use 'cld' to generate CloudinaryImage and CloudinaryVideo objects.
 * Pass these objects to <AdvancedImage /> or <AdvancedVideo /> components.
 */
export const cld = new Cloudinary({
  cloud: {
    cloudName: "taskflowai" // Placeholder, should be in .env
  }
});
