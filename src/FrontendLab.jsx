import FaceRecognition from "/src/computer-vision/FaceRecognition";
import ImageGallery from "/src/util-components/ImageGallery";
import { CVContextProvider } from "/src/contexts/CVContext";
export default function FrontendLab({ info, fetchInfo }) {
  return (
    <main>
      <CVContextProvider>
        <FaceRecognition />
      </CVContextProvider>
    </main>
  );
}
