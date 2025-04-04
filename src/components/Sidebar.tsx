import { useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setSelectedImage } from "../store/imageSlice";
import {
  Box,
  Text,
  VStack,
  Flex,
  Avatar,
  Badge,
  Input,
  IconButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { addReply } from "../store/imageSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const images = useSelector((state: RootState) => state.images.images);
  const selectedImage = useSelector(
    (state: RootState) => state.images.selectedImage
  );

  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleReplyChange = useCallback((commentId: string, value: string) => {
    setReplyTexts((prev) => ({
      ...prev,
      [commentId]: value,
    }));
  }, []);

  const handleAddReply = useCallback(
    (imageUrl: string, commentId: string) => {
      const replyText = replyTexts[commentId];
      if (!replyText?.trim()) return;

      dispatch(
        addReply({
          imageUrl,
          commentId,
          text: replyText,
        })
      );

      handleReplyChange(commentId, "");

      toast({
        title: "Reply added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    },
    [dispatch, replyTexts, handleReplyChange, toast]
  );

  const SidebarContent = () => (
    <>
      {images.length === 0 ? (
        <Text color="gray.500" textAlign="center" mt={10}>
          No images available
        </Text>
      ) : (
        <Accordion
          allowToggle
          defaultIndex={images.findIndex((img) => img.url === selectedImage)}
        >
          {images.map((image) => (
            <AccordionItem key={image.url}>
              <AccordionButton
                py={2}
                bg={selectedImage === image.url ? "blue.50" : "transparent"}
                onClick={() => {
                  dispatch(setSelectedImage(image.url));
                }}
              >
                <Box flex="1" textAlign="left" fontWeight="medium">
                  {image.name}
                  {image.comments?.length > 0 && (
                    <Badge ml={2} colorScheme="blue" borderRadius="full">
                      {image.comments.length}
                    </Badge>
                  )}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} px={2}>
                {image.comments?.length > 0 ? (
                  <VStack align="stretch" spacing={3}>
                    {image.comments.map((comment) => (
                      <Box
                        key={comment.id}
                        p={3}
                        borderRadius="md"
                        border="1px solid"
                        borderColor="gray.200"
                        bg="white"
                        _hover={{ borderColor: "blue.300", cursor: "pointer" }}
                      >
                        <Flex align="center" mb={2}>
                          <Avatar size="xs" mr={2} />
                          <Text fontWeight="medium">
                            Position: {comment.x.toFixed(0)}%,{" "}
                            {comment.y.toFixed(0)}%
                          </Text>
                        </Flex>
                        <Text fontSize="sm" mb={2}>
                          {comment.text}
                        </Text>

                        {comment.replies.length > 0 && (
                          <Box
                            ml={4}
                            mt={2}
                            borderLeft="2px solid"
                            borderColor="gray.200"
                            pl={2}
                          >
                            {comment.replies.map((reply) => (
                              <Flex key={reply.id} mb={1} fontSize="xs">
                                <Avatar size="2xs" mr={1} />
                                <Text>{reply.text}</Text>
                              </Flex>
                            ))}
                          </Box>
                        )}

                        <Flex mt={2}>
                          <Input
                            size="xs"
                            placeholder="Add reply..."
                            value={replyTexts[comment.id] || ""}
                            onChange={(e) =>
                              handleReplyChange(comment.id, e.target.value)
                            }
                            // onClick={(e) => e.stopPropagation()}
                          />
                          <IconButton
                            size="xs"
                            aria-label="Send reply"
                            icon={<IoMdSend />}
                            ml={1}
                            isDisabled={!replyTexts[comment.id]?.trim()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddReply(image.url, comment.id);
                            }}
                          />
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.500" textAlign="center">
                    No comments yet
                  </Text>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );

  return (
    <>
      <IconButton
        aria-label="Open comments"
        icon={<GiHamburgerMenu />}
        position="fixed"
        top="75px"
        left="10px"
        colorScheme="blue"
        size="md"
        zIndex={10}
        onClick={onOpen}
        variant="outline"
        bg="white"
      />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">Comments</DrawerHeader>
          <DrawerBody p={4}>
            <SidebarContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
