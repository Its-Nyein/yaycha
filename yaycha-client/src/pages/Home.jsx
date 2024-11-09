import { useEffect, useState } from "react";
import Item from "../components/Item";
import Form from "../components/Form";
import { Box, Container } from "@mui/material";
import { useApp } from "../ThemeApp";

export default function Home() {
  const { showForm, setGlobalMsg } = useApp();

  const [data, setData] = useState([]);

  useEffect(() => {
    const api = import.meta.env.VITE_API;
    fetch(`${api}/content/posts`).then(async (res) => {
      setData(await res.json());
    });
  }, []);

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
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {showForm && <Form add={add} />}
        {data.map((item) => {
          return <Item key={item.id} item={item} remove={remove} />;
        })}
      </Container>
    </Box>
  );
}
