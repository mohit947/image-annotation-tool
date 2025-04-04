import React from "react";
import { Button, Text, VStack, Input } from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import uploadImage from "../uploadImage.png";
import ImageGallery from "../components/ImageGallery";
import { handleFileUpload } from "../utils/imageUtils";
import { RootState } from "../store/store";
const ImageUploader: React.FC = () => {
  const dispatch = useDispatch();
  const selectedFiles = useSelector(
    (state: RootState) => state.images.selectedFiles
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files, dispatch);
  };

  return (
    <VStack
      p={6}
      align="center"
      justify="center"
      textAlign="center"
      w="100%"
      h="100%"
      cursor="pointer"
    >
      {selectedFiles.length === 0 ? (
        <>
          <img src={uploadImage} />
          <Text fontSize="24px" fontWeight={600} color="black">
            Drop images here
          </Text>
          <Text fontSize="12px" color="gray.600">
            or use Upload button to upload images
          </Text>
        </>
      ) : (
        <>
          <ImageGallery />
        </>
      )}

      {selectedFiles.length === 0 ? (
        <>
          <Input
            id="fileInput"
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleFileChange}
          />

          <Button
            colorScheme="blue"
            padding={"16px"}
            background={"rgb(54, 98, 227)"}
            onClick={() => document.getElementById("fileInput")?.click()}
            leftIcon={<FiUpload strokeWidth={"3px"} />}
          >
            {"Upload"}
          </Button>
        </>
      ) : null}
    </VStack>
  );
};

export default ImageUploader;
