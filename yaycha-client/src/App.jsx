import { useState } from "react";
import Item from "./components/Item";
import Form from "./components/Form";
import "./index.css";
import { Box, Container } from "@mui/material";
import Header from "./components/Header";
import { useApp } from "./ThemeApp";

export default function App() {
  const { showForm, setGlobalMsg } = useApp();

  const [data, setData] = useState([
    { id: 1, content: "Hello, World!", name: "Alice" },
    { id: 2, content: "React is fun.", name: "Bob" },
    { id: 3, content: "Yay, interesting.", name: "Chris" },
  ]);

  const add = (content, name) => {
    const id = data[0].id + 1;
    setData([{ id, content, name }, ...data]);
    setGlobalMsg("An Item Added.");
  };

  const remove = (id) => {
    setData(data.filter((d) => d.id !== id));
    setGlobalMsg("An Item Deleted.");
  };

  return (
    <Box>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {showForm && <Form add={add} />}
        {data.map((item) => {
          return <Item key={item.id} item={item} remove={remove} />;
        })}
      </Container>
    </Box>
  );
}
