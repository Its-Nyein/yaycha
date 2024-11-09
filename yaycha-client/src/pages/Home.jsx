import { useEffect, useState } from "react";
import Item from "../components/Item";
import Form from "../components/Form";
import { Alert, Box, Container } from "@mui/material";
import { useApp } from "../ThemeApp";

export default function Home() {
  const { showForm, setGlobalMsg } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [data, setData] = useState([]);

  useEffect(() => {
    const api = import.meta.env.VITE_API;
    fetch(`${api}/content/posts`)
      .then(async (res) => {
        if (res.ok) {
          setData(await res.json());
          setLoading(false);
        } else {
          setError(true);
        }
      })
      .catch(() => {
        setError(true);
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

  if (error) {
    return (
      <Box>
        <Alert severity="warning">Cannot fetch data</Alert>
      </Box>
    );
  }

  if (loading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

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
