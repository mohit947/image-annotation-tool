import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Flex,
  Avatar,
  Text,
  IconButton,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  addReply,
  editComment,
  deleteComment,
  editReply,
  deleteReply,
} from "../../store/imageSlice";
import { useDebounce } from "../../utils/useDebounce";
import { RootState } from "../../store/store";
import { InputGroup, InputRightElement } from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";

interface CommentThreadProps {
  comment: {
    id: string;
    x: number;
    y: number;
    text: string;
    replies: { id: string; text: string }[];
  };
  onClose: () => void;
}

const CommentThread: React.FC<CommentThreadProps> = ({ comment, onClose }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const selectedImage = useSelector(
    (state: RootState) => state.images.selectedImage
  );

  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<{
    commentId: string;
    replyId: string;
  } | null>(null);
  const [editText, setEditText] = useState("");
  const replyInputRef = useRef<HTMLInputElement>(null);

  const debouncedReplyText = useDebounce(replyText, 300);
  const debouncedEditText = useDebounce(editText, 300);

  const handleReplySubmit = () => {
    if (!debouncedReplyText) return;

    const imageUrl = selectedImage || comment.id;

    dispatch(
      addReply({
        imageUrl,
        commentId: comment.id,
        text: debouncedReplyText,
      })
    );

    setReplyText("");
  };

  const handleEditComment = () => {
    setEditingComment(comment.id);
    setEditText(comment.text);
  };

  const saveEditedComment = () => {
    if (!debouncedEditText.trim()) return;

    const imageUrl = selectedImage || comment.id;

    dispatch(
      editComment({
        imageUrl,
        commentId: comment.id,
        newText: debouncedEditText,
      })
    );

    setEditingComment(null);
    setEditText("");

    toast({
      title: "Comment updated",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeleteComment = () => {
    const imageUrl = selectedImage || comment.id;

    dispatch(
      deleteComment({
        imageUrl,
        commentId: comment.id,
      })
    );

    onClose();

    toast({
      title: "Comment deleted",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleEditReply = (replyId: string) => {
    const reply = comment.replies.find((r) => r.id === replyId);
    if (reply) {
      setEditingReply({ commentId: comment.id, replyId });
      setEditText(reply.text);
    }
  };

  const saveEditedReply = () => {
    if (!editingReply || !debouncedEditText.trim()) return;

    const imageUrl = selectedImage || comment.id;

    dispatch(
      editReply({
        imageUrl,
        commentId: editingReply.commentId,
        replyId: editingReply.replyId,
        newText: debouncedEditText,
      })
    );

    setEditingReply(null);
    setEditText("");

    toast({
      title: "Reply updated",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleDeleteReply = (replyId: string) => {
    const imageUrl = selectedImage || comment.id;

    dispatch(
      deleteReply({
        imageUrl,
        commentId: comment.id,
        replyId,
      })
    );

    toast({
      title: "Reply deleted",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box
      position="absolute"
      left={`${comment.x + 1}%`}
      top={`${comment.y}%`}
      bg="white"
      boxShadow="lg"
      borderRadius="md"
      width={["auto", "280px"]}
      zIndex={3}
      onClick={(e) => e.stopPropagation()}
    >
      <Box p={"8px"} borderRadius={"6px"}>
        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Text fontWeight="bold" fontSize="sm">
              Comment
            </Text>
          </Flex>
          <IconButton
            aria-label="Close comment"
            icon={<IoClose />}
            size="xs"
            variant="ghost"
            onClick={onClose}
          />
        </Flex>
      </Box>
      <Divider />
      <Box p={3} maxH="300px" overflowY="auto">
        <Flex mb={3}>
          <Avatar size="sm" name="User" mr={2} />
          <Box flex="1">
            <Flex justify="space-between" align="start">
              <Text fontSize="xs" fontWeight="bold">
                User
              </Text>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<BsThreeDotsVertical />}
                  variant="ghost"
                  size="xs"
                  aria-label="Options"
                />
                <MenuList minW="120px">
                  <MenuItem onClick={handleEditComment}>Edit</MenuItem>
                  <MenuItem onClick={handleDeleteComment} color="red.500">
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>

            {editingComment === comment.id ? (
              <VStack mt={1} align="stretch">
                <Input
                  size="sm"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  autoFocus
                />
                <Flex justify="flex-end" gap={2}>
                  <Button size="xs" onClick={() => setEditingComment(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    onClick={saveEditedComment}
                  >
                    Save
                  </Button>
                </Flex>
              </VStack>
            ) : (
              <Text fontSize="sm">{comment.text}</Text>
            )}
          </Box>
        </Flex>

        <Divider my={2} />

        {comment.replies.map((reply) => (
          <Flex key={reply.id} mb={3}>
            <Avatar size="sm" name="Replier" mr={2} />
            <Box flex="1">
              <Flex justify="space-between" align="start">
                <Text fontSize="xs" fontWeight="bold">
                  Replier
                </Text>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<BsThreeDotsVertical />}
                    variant="ghost"
                    size="xs"
                    aria-label="Reply options"
                  />
                  <MenuList minW="120px">
                    <MenuItem onClick={() => handleEditReply(reply.id)}>
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleDeleteReply(reply.id)}
                      color="red.500"
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>

              {editingReply &&
              editingReply.commentId === comment.id &&
              editingReply.replyId === reply.id ? (
                <VStack mt={1} align="stretch">
                  <Input
                    size="sm"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <Flex justify="flex-end" gap={2}>
                    <Button size="xs" onClick={() => setEditingReply(null)}>
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={saveEditedReply}
                    >
                      Save
                    </Button>
                  </Flex>
                </VStack>
              ) : (
                <Text fontSize="sm">{reply.text}</Text>
              )}
            </Box>
          </Flex>
        ))}

        <Flex mt={2}>
          <Avatar size="sm" name="You" mr={2} />
          <Box flex="1">
            <InputGroup size="sm">
              <Input
                ref={replyInputRef}
                placeholder="Add Reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              {debouncedReplyText ? (
                <InputRightElement>
                  <IconButton
                    size="sm"
                    icon={<IoMdSend />}
                    aria-label="Send reply"
                    onClick={handleReplySubmit}
                    colorScheme="blue"
                    variant="ghost"
                  />
                </InputRightElement>
              ) : null}
            </InputGroup>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default React.memo(CommentThread);
