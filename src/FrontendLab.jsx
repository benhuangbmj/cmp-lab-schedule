import { useRef, useEffect, useState } from "react";
import PostDisplay from "/src/devBlog/PostDisplay";
export default function FrontendLab({ info, fetchInfo }) {
  const [color, setColor] = useState("purple");
  const [color2, setColor2] = useState("purple");

  const [touch, setTouch] = useState(["ready?", "ready?"]);
  const block = useRef();
  const block2 = useRef();

  useEffect(() => {
    window.addEventListener("touchmove", (ev) => {
      setTouch([ev.touches[0].clientX, ev.touches[0].clientY]);
    });
    console.log(block);
  }, []);
  return (
    <main
      style={{ border: "1px solid blue" }}
      onPointerMove={(e) => {
        console.log("move!", e.pointerType);
        console.log(e.clientX, e.clientY);
      }}
    >
      <div
        className="designing"
        ref={block}
        style={{ background: color, width: "1in", height: "1in" }}
        onPointerOver={(e) => {
          console.log("enter!", "pointerId", e.pointerId, e.pointerType);
          block.current.releasePointerCapture(e.pointerId);
          setColor("green");
        }}
        onPointerOut={(e) => {
          setColor("yellow");
          console.log("leave!");
          block.current.releasePointerCapture(e.pointerId);
        }}
      ></div>
      <div
        className="designing"
        ref={block2}
        style={{ background: color2, width: "1in", height: "1in" }}
        onPointerEnter={(e) => {
          console.log("enter!", "pointerId", e.pointerId);
          block2.current.releasePointerCapture(e.pointerId);
          setColor2("green");
        }}
        onPointerLeave={(e) => {
          setColor2("yellow");
          console.log("leave!");
          block2.current.releasePointerCapture(e.pointerId);
        }}
      ></div>
      <div>
        {touch[0]}, {touch[1]}
      </div>
      <PostDisplay />
    </main>
  );
}
