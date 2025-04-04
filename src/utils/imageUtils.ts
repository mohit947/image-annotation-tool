import { addImages, addSelectedFiles } from "../store/imageSlice";

interface ImageData {
  url: string;
  name: string;
  comments?: any[];
}

export const handleFileUpload = (
  files: FileList | null,
  dispatch: any
): ImageData[] => {
  if (!files) return [];

  const newImages = Array.from(files).map((file) => ({
    url: URL.createObjectURL(file),
    name: file.name,
    comments: [],
  }));

  dispatch(addSelectedFiles(Array.from(files)));

  dispatch(addImages(newImages));
  return newImages;
};
