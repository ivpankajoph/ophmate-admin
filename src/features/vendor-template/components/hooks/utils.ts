import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "@/store/slices/vendor/productSlice";

// Upload image to Cloudinary
export async function uploadImage(file: File) {
  try {
    const { data: signatureData } = await axios.get(
      `${BASE_URL}/cloudinary/signature`
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signatureData.apiKey);
    formData.append("timestamp", signatureData.timestamp);
    formData.append("signature", signatureData.signature);
    formData.append("folder", "ecommerce");

    const uploadRes = await axios.post(
      `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
      formData
    );

    return uploadRes.data.secure_url;
  } catch (err) {
    console.error("Upload failed:", err);
    toast.error("Image upload failed");
    return null;
  }
}

// Immutably update nested state
export function updateFieldImmutable(obj: any, path: string[], value: any) {
  const clone = structuredClone(obj);
  let current = clone;

  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }

  current[path[path.length - 1]] = value;
  return clone;
}
