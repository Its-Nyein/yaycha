import { useContext } from "react";
import { Box, Alert } from "@mui/material";
import Form from "../components/Form";
import Item from "../components/Item";
import { AppContext } from "../ThemeApp";
import { useQuery, useMutation } from "react-query";
import { queryClient } from "../ThemeApp";

const api = import.meta.env.VITE_API;
export default function Home() {
  const { showForm, setGlobalMsg } = useContext(AppContext);
  const { isLoading, isError, error, data } = useQuery("posts", async () => {
    const res = await fetch(`${api}/content/posts`);
    return res.json();
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
      {showForm && <Form add={add} />}
      {data.map((item) => {
        return <Item key={item.id} item={item} remove={remove.mutate} />;
      })}
    </Box>
  );
}
