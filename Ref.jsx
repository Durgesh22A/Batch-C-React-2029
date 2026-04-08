import React, { useRef, useState } from "react";

function Ref() {
  const [text, setText] = useState("");

  let inputRef = useRef(null);
  console.log(inputRef);

  function reset() {
    setText("");
    inputRef.current.focus();
    inputRef.current.style.backgroundColor = "red";
  }

  console.log('Re-rendered')

  return (
    <div>
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <h2>{text}</h2>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default Ref;
