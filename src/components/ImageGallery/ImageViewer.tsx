import React, { useState } from "react";
import { Box, Image, useDisclosure } from "@chakra-ui/react";
import { BiCommentAdd } from "react-icons/bi";
import ReactDOMServer from "react-dom/server";
import CommentMarker from "./CommentMarker";
import CommentPopover from "./CommentPopover";

interface ImageViewerProps {
  image: {
    url: string;
    name: string;
    comments: Array<{
      id: string;
      x: number;
      y: number;
      text: string;
      replies: { id: string; text: string }[];
    }>;
  };
}

const ImageViewer: React.FC<ImageViewerProps> = ({ image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [clickPosition, setClickPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [activeCommentThread, setActiveCommentThread] = useState<string | null>(
    null
  );
  const [hoveredCommentId, setHoveredCommentId] = useState<string | null>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const target = e.currentTarget as HTMLImageElement;
    if (!target) return;

    setActiveCommentThread(null);

    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    const x = (offsetX / target.width) * 100;
    const y = (offsetY / target.height) * 100;

    setClickPosition({ x, y });
    onOpen();
  };

  const createSvgCursor = (icon: React.ReactElement) => {
    const svgString = ReactDOMServer.renderToString(icon);
    const encodedSvg = encodeURIComponent(svgString);
    return `url("data:image/svg+xml,${encodedSvg}"), auto`;
  };

  const handleCommentClick = (commentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveCommentThread(
      activeCommentThread === commentId ? null : commentId
    );
  };

  return (
    <Box position="relative">
      <Image
        src={image.url}
        alt={image.name}
        maxH="500px"
        w="100%"
        objectFit="contain"
        onClick={handleImageClick}
        cursor={createSvgCursor(<BiCommentAdd color="black" size={24} />)}
      />

      {image.comments?.map((comment) => (
        <CommentMarker
          key={comment.id}
          comment={comment}
          activeCommentThread={activeCommentThread}
          hoveredCommentId={hoveredCommentId}
          onCommentClick={handleCommentClick}
          onCommentHover={(e) => {
            e.stopPropagation();
            setHoveredCommentId(comment.id);
          }}
          onCommentLeave={(e) => {
            e.stopPropagation();
            setHoveredCommentId(null);
          }}
          setActiveCommentThread={setActiveCommentThread}
        />
      ))}

      {clickPosition && (
        <CommentPopover
          isOpen={isOpen}
          onClose={onClose}
          clickPosition={clickPosition}
          imageUrl={image.url}
        />
      )}
    </Box>
  );
};

export default ImageViewer;
