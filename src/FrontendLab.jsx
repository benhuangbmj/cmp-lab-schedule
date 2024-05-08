import { useRef, useEffect, useState } from "react";
import PostDisplay from "/src/devBlog/PostDisplay";
export default function FrontendLab({ info, fetchInfo }) {
  const [color, setColor] = useState("blue")
  useEffect(() => {
    window.addEventListener('touchstart', ()=>{
      setColor('red');
    })
  })
  return (
    <>
    <div style={{background: color, width: "1in", height:'1in'}}></div>
      <PostDisplay />
    </>
  );
}
