import Item from "../components/Item";
import Form from "../components/Form";
import { Alert, Box, Container } from "@mui/material";
import { queryClient, useApp } from "../ThemeApp";
import { useQuery, useMutation } from "react-query";

const api = import.meta.env.VITE_API;

export default function Home() {
  const { showForm, setGlobalMsg } = useApp();
  const { isLoading, isError, error, data } = useQuery("posts", async () => {
    const res = await fetch(`${api}/content/posts`);
    return res.json();
  });

  const add = () => {
    setGlobalMsg("An Item Added.");
  };

  const remove = useMutation(
    async (id) => {
      await fetch(`${api}/content/posts/${id}`, {
        method: "DELETE",
      });
    },
    {
      onMutate: (id) => {
        queryClient.cancelQueries("posts");
        queryClient.setQueryData("posts", (old) =>
          old.filter((item) => item.id !== id)
        );
        setGlobalMsg("An post deleted.");
      },
    }
  );

  if (isError) {
    return (
      <Box>
        <Alert severity="warning">{error.message}</Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Box sx={{ textAlign: "center" }}>Loading...</Box>;
  }

  return (
    <Box>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {showForm && <Form add={add} />}
        {data.map((item) => {
          return <Item key={item.id} item={item} remove={remove.mutate} />;
        })}
      </Container>
    </Box>
  );
}
