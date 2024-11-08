import { useContext, useRef } from "react";
import { AppContent } from "./ThemeApp";

const Form = ({ add }) => {
  const { mode } = useContext(AppContent);

  const contentRef = useRef();
  const nameRef = useRef();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const content = contentRef.current.value;
        const name = nameRef.current.value;

        add(content, name);
        e.currentTarget.reset();
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
        background: mode === "dark" ? "#555" : "#def",
      }}
    >
      <input
        type="text"
        placeholder="Content"
        style={{ padding: 5 }}
        ref={contentRef}
      />
      <input
        type="text"
        placeholder="Name"
        style={{ padding: 5 }}
        ref={nameRef}
      />
      <button
        type="submit"
        style={{
          padding: 8,
          background: "#0d6efd",
          color: "white",
          border: "0 none",
        }}
      >
        Post
      </button>
    </form>
  );
};

export default Form;
