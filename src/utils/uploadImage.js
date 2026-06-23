import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/config";

/**
 * Uploads a file to Firebase Storage and returns the download URL.
 * @param {File} file - The file to upload.
 * @param {string} folder - The folder name in Firebase Storage (e.g. 'projects', 'skills').
 * @returns {Promise<string>} The download URL of the uploaded file.
 */
export const uploadImage = async (file, folder) => {
  if (!file) return null;
  
  // Create a unique file name to avoid overwriting
  const fileName = `${new Date().getTime()}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  
  // Upload the file
  const uploadTask = await uploadBytesResumable(storageRef, file);
  
  // Get the download URL
  const downloadURL = await getDownloadURL(uploadTask.ref);
  return downloadURL;
};

/**
 * Uploads multiple files to Firebase Storage and returns an array of download URLs.
 * @param {FileList|Array<File>} files - The files to upload.
 * @param {string} folder - The folder name in Firebase Storage.
 * @returns {Promise<Array<string>>} The download URLs of the uploaded files.
 */
export const uploadMultipleImages = async (files, folder) => {
  if (!files || files.length === 0) return [];
  
  const uploadPromises = Array.from(files).map(file => uploadImage(file, folder));
  const downloadURLs = await Promise.all(uploadPromises);
  
  return downloadURLs;
};
