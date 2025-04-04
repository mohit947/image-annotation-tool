import React from "react";
import { Card, Flex, Text, Image } from "@chakra-ui/react";
import { IoImageOutline } from "react-icons/io5";

interface ImageData {
  url: string;
  name: string;
  comments: Array<{
    id: string;
    x: number;
    y: number;
    text: string;
    replies: { id: string; text: string }[];
  }>;
}

interface ImageCardProps {
  image: ImageData;
  onClick: () => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onClick }) => {
  return (
    <Card
      p={2}
      borderRadius="6px"
      border={"1px solid gray.500"}
      cursor="pointer"
      _hover={{
        transform: "scale(1.05)",
        transition: "0.2s ease-in-out",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onClick={onClick}
    >
      <Flex alignItems={"center"} gap={"6px"} mb={"10px"}>
        <IoImageOutline />
        <Text fontSize="sm" textAlign="center">
          {image.name}
        </Text>
      </Flex>
      <Image
        src={image.url}
        alt={image.name}
        objectFit="cover"
        w="100%"
        h="150px"
        borderRadius="md"
        cursor={"pointer"}
      />

      {image.comments?.length > 0 && (
        <Flex justify="center" mt={1}>
          <Text fontSize="xs" color="gray.500">
            {image.comments.length} comment
            {image.comments.length !== 1 ? "s" : ""}
          </Text>
        </Flex>
      )}
    </Card>
  );
};

export default React.memo(ImageCard);
