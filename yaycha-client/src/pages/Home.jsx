import { useContext } from "react";
import { Box, Alert } from "@mui/material";
import Form from "../components/Form";
import Item from "../components/Item";
import { AppContext } from "../ThemeApp";
import { useQuery, useMutation } from "react-query";
import { queryClient } from "../ThemeApp";
import { postPost } from "../libs/fetcher";

const api = import.meta.env.VITE_API;
export default function Home() {
  const { showForm, setGlobalMsg, auth } = useContext(AppContext);
  const { isLoading, isError, error, data } = useQuery("posts", async () => {
    const res = await fetch(`${api}/content/posts`);
    return res.json();
  });

  const add = useMutation(async (content) => postPost(content), {
    onMutate: async (post) => {
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
        queryClient.cancelMutations("posts");
        queryClient.setQueryData("posts", (item) =>
          item.filter((i) => i.id !== id)
        );
        setGlobalMsg("A post deleted");
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
      {showForm && auth && <Form add={add.mutate} />}
      {data.map((item, index) => {
        return (
          <Item
            key={`${item.id}-${index}`}
            item={item}
            remove={remove.mutate}
          />
        );
      })}
    </Box>
  );
}
