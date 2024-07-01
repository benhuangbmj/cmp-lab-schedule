import { useRef, useEffect, useState } from "react";
//import PostDisplay from "/src/devBlog/PostDisplay";
import TextDetection from "/src/computer-vision/TextDetection";
import CheckInWithID from "/src/computer-vision/CheckInWithID";
export default function FrontendLab({ info, fetchInfo }) {
  const [color, setColor] = useState("blue");
  const block = useRef();
  const block2 = useRef();

  return (
    <main>
      <CheckInWithID />
    </main>
  );
}
