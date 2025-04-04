import React from "react";
import { Box, Avatar, Flex, Text } from "@chakra-ui/react";
import CommentThread from "./CommentThread";

interface CommentMarkerProps {
  comment: {
    id: string;
    x: number;
    y: number;
    text: string;
    replies: { id: string; text: string }[];
  };
  activeCommentThread: string | null;
  hoveredCommentId: string | null;
  onCommentClick: (commentId: string, e: React.MouseEvent) => void;
  onCommentHover: (e: React.MouseEvent) => void;
  onCommentLeave: (e: React.MouseEvent) => void;
  setActiveCommentThread: (id: string | null) => void;
}

const CommentMarker: React.FC<CommentMarkerProps> = ({
  comment,
  activeCommentThread,
  hoveredCommentId,
  onCommentClick,
  onCommentHover,
  onCommentLeave,
  setActiveCommentThread,
}) => {
  return (
    <React.Fragment>
      <Box
        position="absolute"
        left={`${comment.x}%`}
        top={`${comment.y}%`}
        transform="translate(-50%, -50%)"
        cursor={"pointer"}
        zIndex={2}
        onClick={(e) => onCommentClick(comment.id, e)}
        onMouseEnter={onCommentHover}
        onMouseLeave={onCommentLeave}
      >
        <Avatar size="sm" name="User" />
      </Box>

      {hoveredCommentId === comment.id &&
        activeCommentThread !== comment.id && (
          <Box
            position="absolute"
            left={`${comment.x + 1}%`}
            top={`${comment.y}%`}
            bg="white"
            boxShadow="md"
            borderRadius="md"
            width={["auto", "200px"]}
            zIndex={3}
            p={2}
            onClick={(e) => e.stopPropagation()}
          >
            <Flex align="center">
              <Avatar size="sm" name="User" mr={2} />
              <Text fontSize="sm" noOfLines={2}>
                {comment.text}
              </Text>
            </Flex>
            {comment.replies.length > 0 && (
              <Text fontSize="xs" color="gray.500" mt={1}>
                {comment.replies.length}{" "}
                {comment.replies.length === 1 ? "reply" : "replies"}
              </Text>
            )}
          </Box>
        )}

      {activeCommentThread === comment.id && (
        <CommentThread
          comment={comment}
          onClose={() => setActiveCommentThread(null)}
        />
      )}
    </React.Fragment>
  );
};

export default React.memo(CommentMarker);
