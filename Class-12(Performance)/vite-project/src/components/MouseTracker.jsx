import React, { useEffect, useState } from "react";

function MouseTracker() {
  const [track, setTrack] = useState("x");

  useEffect(() => {
    function handleMouseMove(e) {
      if (track === "x") {
        console.log("X Tracking", e.clientX);
      } else {
        console.log("Y Tracking", e.clientY);
      }
    }

    window.addEventListener("mousemove", handleMouseMove);
  }, [track]);

  return (
    <div>
      <h2></h2>

      <button onClick={() => setTrack("x")}>Track X</button>
      <button onClick={() => setTrack("y")}>Track Y</button>
    </div>
  );
}

export default MouseTracker;
