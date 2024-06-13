import { useRef, useEffect, useState } from "react";
import PostDisplay from "/src/devBlog/PostDisplay";
export default function FrontendLab({ info, fetchInfo }) {
  const [color, setColor] = useState("blue");
  const block = useRef();
  const block2 = useRef();
  const refVideo = useRef();
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: true,
      })
      .then((stream) => {
        const video = refVideo.current;
        video.srcObject = stream;
        video.onloadedmetadata = (e) => {
          video.play();
        };
      });
  });
  return (
    <main
      ref={block2}
      style={{ touchAction: "none" }}
      onPointerMove={(e) => {
        //console.log("outer move", e.pointerId);
        block2.current.releasePointerCapture(e.pointerId);
      }}
    >
      <div
        ref={block}
        style={{ background: color, width: "1in", height: "1in" }}
        onPointerEnter={(e) => {
          setColor("red");
          //console.log("enter", e.pointerId);
        }}
        onPointerMove={(e) => {
          //console.log("inner move", e.pointerId);
          block.current.releasePointerCapture(e.pointerId);
        }}
        onPointerLeave={(e) => {
          setColor("blue");
          //console.log("leave", e.pointerId);
        }}
      ></div>
      <video ref={refVideo} controls muted autoplay></video>
    </main>
  );
}
