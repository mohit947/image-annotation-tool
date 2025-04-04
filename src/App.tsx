import { Box, Flex } from "@chakra-ui/react";
import ImageUploader from "./components/ImageUploader";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

const App = () => {
  return (
    <Box background={"rgb(248,248,248)"}>
      <Header />
      <Flex>
        <Sidebar />
        <Box flex="1">
          <ImageUploader />
        </Box>
      </Flex>
    </Box>
  );
};

export default App;
