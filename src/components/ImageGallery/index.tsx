import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  Box,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import ImageCard from "./ImageCard";
import ImageViewer from "./ImageViewer";
import { setSelectedImage } from "../../store/imageSlice";

const ImageGallery: React.FC = () => {
  const dispatch = useDispatch();
  const images = useSelector((state: RootState) => state.images.images);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImageUrl(imageUrl);
    dispatch(setSelectedImage(imageUrl));
  };

  const handleCloseModal = () => {
    setSelectedImageUrl(null);
    dispatch(setSelectedImage(null));
  };

  const selectedImage = selectedImageUrl
    ? images.find((img) => img.url === selectedImageUrl) || null
    : null;

  return (
    <Box p={5} w="100%">
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
        {images.map((image, index) => (
          <ImageCard
            key={index}
            image={image}
            onClick={() => handleImageSelect(image.url)}
          />
        ))}
      </Grid>

      <Modal isOpen={!!selectedImage} onClose={handleCloseModal} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedImage?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedImage && <ImageViewer image={selectedImage} />}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImageGallery;
