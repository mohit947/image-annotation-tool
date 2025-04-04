import React, { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Box,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { IoMdSend } from "react-icons/io";
import { addComment } from "../../store/imageSlice";
import { useDebounce } from "../../utils/useDebounce";

interface CommentPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  clickPosition: { x: number; y: number };
  imageUrl: string;
}

const CommentPopover: React.FC<CommentPopoverProps> = ({
  isOpen,
  onClose,
  clickPosition,
  imageUrl,
}) => {
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState("");
  const commentInputRef = useRef<HTMLInputElement>(null);

  const debouncedCommentText = useDebounce(commentText, 300);

  const handleCommentSubmit = () => {
    if (!debouncedCommentText) return;

    dispatch(
      addComment({
        imageUrl,
        x: clickPosition.x,
        y: clickPosition.y,
        text: debouncedCommentText,
      })
    );

    setCommentText("");
    onClose();
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={onClose}
      placement="right"
      closeOnBlur={false}
      initialFocusRef={commentInputRef}
    >
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${clickPosition.x}%`}
          top={`${clickPosition.y}%`}
          width="1px"
          height="1px"
        />
      </PopoverTrigger>
      <PopoverContent width={"auto"}>
        <InputGroup size="sm">
          <Input
            ref={commentInputRef}
            placeholder="Add Comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          {debouncedCommentText ? (
            <InputRightElement>
              <IconButton
                size="sm"
                icon={<IoMdSend />}
                aria-label="Send comment"
                onClick={handleCommentSubmit}
                colorScheme="blue"
                variant="ghost"
              />
            </InputRightElement>
          ) : null}
        </InputGroup>
      </PopoverContent>
    </Popover>
  );
};

export default React.memo(CommentPopover);
