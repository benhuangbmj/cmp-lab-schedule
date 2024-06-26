import { useState, useEffect, useRef } from "react";
import cv from "@techstark/opencv-js";

export default function FaceDetection({ modelLoaded, setModelLoaded }) {
  const refVideo = useRef();
  const refCanvas = useRef();
  const [faceCount, setFaceCount] = useState(0);
  const refTracks = useRef();
  useEffect(() => {
    const video = refVideo.current;
    const canvas = refCanvas.current;
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        video.srcObject = stream;
        refTracks.current = stream.getTracks();
        if (!modelLoaded) {
          const url = "src/opencv/haarcascade_frontalface_default.xml";
          fetch(url)
            .then((response) => response.arrayBuffer())
            .then((buffer) => {
              const data = new Uint8Array(buffer);
              cv.FS_createDataFile(
                "/",
                "haarcascade_frontalface_default.xml",
                data,
                true,
                false,
                false,
              );
              setModelLoaded(true);
            });
        }
      })
      .then(() => {
        if (modelLoaded) {
          let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
          let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4);
          let gray = new cv.Mat();
          let cap = new cv.VideoCapture(video);
          let faces = new cv.RectVector();
          let classifier = new cv.CascadeClassifier();
          classifier.load("haarcascade_frontalface_default.xml");
          const FPS = 30;
          function processVideo() {
            let begin = Date.now();
            // start processing.
            cap.read(src);
            src.copyTo(dst);
            cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0);
            // detect faces.
            classifier.detectMultiScale(gray, faces, 1.1, 3, 0);
            // draw faces.
            setFaceCount(faces.size());
            for (let i = 0; i < faces.size(); i++) {
              let face = faces.get(i);
              let point1 = new cv.Point(face.x, face.y);
              let point2 = new cv.Point(
                face.x + face.width,
                face.y + face.height,
              );
              cv.rectangle(dst, point1, point2, [255, 0, 0, 255]);
            }
            cv.imshow(canvas, dst);
            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
          }
          setTimeout(processVideo, 0);
        }
      });
    return () => {
      if (refTracks.current) {
        refTracks.current.forEach((track) => track.stop());
      }
    };
  }, [modelLoaded]);
  return (
    <>
      <video
        ref={refVideo}
        controls
        muted
        autoPlay
        width="500"
        height="500"
      ></video>
      <canvas
        ref={refCanvas}
        width="500"
        height="500"
        style={{ border: "1px solid red" }}
      ></canvas>
      <p>Faces detected: {faceCount} </p>
    </>
  );
}
