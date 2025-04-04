import React from "react";
import { Flex, Heading, Spacer, Button, Input } from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { handleFileUpload } from "../utils/imageUtils";

const Header = () => {
  const images = useSelector((state: RootState) => state.images.images);
  const dispatch = useDispatch();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileUpload(event.target.files, dispatch);
  };
  return (
    <Flex
      p={4}
      bg="white"
      borderBottom="1px"
      borderColor="gray.200"
      align="center"
      width="100%"
      justifyContent={"space-between"}
      position={"sticky"}
      zIndex={1}
      top={0}
    >
      <Heading size="md" fontWeight={"500"} color="gray.800">
        Folder
      </Heading>

      {images.length ? (
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
            padding={"12px 16px"}
            background={"rgb(54, 98, 227)"}
            onClick={() => document.getElementById("fileInput")?.click()}
            leftIcon={<FiUpload strokeWidth={"3px"} />}
          >
            Upload
          </Button>
        </>
      ) : null}
    </Flex>
  );
};

export default Header;
