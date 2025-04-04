import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageState {
  images: { url: string; name: string; comments: Comment[] }[];
  selectedImage: string | null;
  selectedFiles: File[];
}

interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  replies: { id: string; text: string }[];
}

const initialState: ImageState = {
  images: [],
  selectedImage: null,
  selectedFiles: [],
};

const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    addImages: (
      state,
      action: PayloadAction<{ url: string; name: string }[]>
    ) => {
      action.payload.forEach((image) => {
        if (!state.images.some((img) => img.url === image.url)) {
          state.images.push({ ...image, comments: [] });
        }
      });
    },
    addSelectedFiles: (state, action: PayloadAction<File[]>) => {
      state.selectedFiles = [...state.selectedFiles, ...action.payload];
    },
    setSelectedImage: (state, action: PayloadAction<string | null>) => {
      state.selectedImage = action.payload;
    },
    addComment: (
      state,
      action: PayloadAction<{
        imageUrl: string;
        x: number;
        y: number;
        text: string;
      }>
    ) => {
      const { imageUrl, x, y, text } = action.payload;
      const image = state.images.find((img) => img.url === imageUrl);
      if (image) {
        image.comments.push({
          id: Date.now().toString(),
          x,
          y,
          text,
          replies: [],
        });
      }
    },
    addReply: (
      state,
      action: PayloadAction<{
        imageUrl: string;
        commentId: string;
        text: string;
      }>
    ) => {
      const { imageUrl, commentId, text } = action.payload;
      const image = state.images.find((img) => img.url === imageUrl);
      if (image) {
        const comment = image.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.replies.push({
            id: Date.now().toString(),
            text,
          });
        }
      }
    },
    editComment: (
      state,
      action: PayloadAction<{
        imageUrl: string;
        commentId: string;
        newText: string;
      }>
    ) => {
      const { imageUrl, commentId, newText } = action.payload;
      const image = state.images.find((img) => img.url === imageUrl);
      if (image) {
        const comment = image.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.text = newText;
        }
      }
    },
    deleteComment: (
      state,
      action: PayloadAction<{
        imageUrl: string;
        commentId: string;
      }>
    ) => {
      const { imageUrl, commentId } = action.payload;
      const image = state.images.find((img) => img.url === imageUrl);
      if (image) {
        image.comments = image.comments.filter((c) => c.id !== commentId);
      }
    },
    editReply: (
      state,
      action: PayloadAction<{
        imageUrl: string;
        commentId: string;
        replyId: string;
        newText: string;
      }>
    ) => {
      const { imageUrl, commentId, replyId, newText } = action.payload;
      const image = state.images.find((img) => img.url === imageUrl);
      if (image) {
        const comment = image.comments.find((c) => c.id === commentId);
        if (comment) {
          const reply = comment.replies.find((r) => r.id === replyId);
          if (reply) {
            reply.text = newText;
          }
        }
      }
    },
    deleteReply: (
      state,
      action: PayloadAction<{
        imageUrl: string;
        commentId: string;
        replyId: string;
      }>
    ) => {
      const { imageUrl, commentId, replyId } = action.payload;
      const image = state.images.find((img) => img.url === imageUrl);
      if (image) {
        const comment = image.comments.find((c) => c.id === commentId);
        if (comment) {
          comment.replies = comment.replies.filter((r) => r.id !== replyId);
        }
      }
    },
  },
});

export const {
  addImages,
  addSelectedFiles,
  setSelectedImage,
  addComment,
  addReply,
  editComment,
  deleteComment,
  editReply,
  deleteReply,
} = imageSlice.actions;
export default imageSlice.reducer;
