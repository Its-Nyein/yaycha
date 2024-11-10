import Item from "../components/Item";
import Form from "../components/Form";
import { Alert, Box, Container } from "@mui/material";
import { queryClient, useApp } from "../ThemeApp";
import { useQuery, useMutation } from "react-query";
import { postPost } from "../components/libs/fetcher.js";

const api = import.meta.env.VITE_API;

export default function Home() {
  const { showForm, setShowForm, setGlobalMsg, auth } = useApp();
  const { isLoading, isError, error, data } = useQuery("posts", async () => {
    const res = await fetch(`${api}/content/posts`);
    return res.json();
  });

  const add = useMutation(async (content) => postPost(content), {
    onSuccess: async (post) => {
      await queryClient.cancelQueries("posts");
      await queryClient.setQueryData("posts", (old) => [post, ...old]);
      setGlobalMsg("A post added");
    },
  });

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

  if (showForm && !auth) {
    setGlobalMsg("Please login first to add posts.");
    setTimeout(() => {
      setShowForm(false);
    }, 5000);
  }

  return (
    <Box>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {showForm && auth && <Form add={add.mutate} />}
        {data.map((item) => {
          return <Item key={item.id} item={item} remove={remove.mutate} />;
        })}
      </Container>
    </Box>
  );
}
