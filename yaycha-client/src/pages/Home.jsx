import Item from "../components/Item";
import Form from "../components/Form";
import { Alert, Box, Button, Container, Typography } from "@mui/material";
import { queryClient, useApp } from "../ThemeApp";
import { useQuery, useMutation } from "react-query";
import {
  postPost,
  fetchAllPosts,
  fetchFollowingPosts,
  deletePost,
} from "../components/libs/fetcher.js";
import { useState } from "react";

export default function Home() {
  const [showLatest, setShowLatest] = useState(true);

  const { showForm, setShowForm, setGlobalMsg, auth } = useApp();
  const { isLoading, isError, error, data } = useQuery(
    ["posts", showLatest],
    async () => {
      if (showLatest) return fetchAllPosts();
      else return fetchFollowingPosts();
    }
  );

  const add = useMutation(async (content) => postPost(content), {
    onSuccess: async (post) => {
      await queryClient.cancelQueries("posts");
      await queryClient.setQueryData(["posts", showLatest], (old) => [
        post,
        ...old,
      ]);
      setGlobalMsg("A post added");
    },
  });

  const remove = useMutation(async (id) => deletePost(id), {
    onMutate: async (id) => {
      await queryClient.cancelQueries("posts");
      await queryClient.setQueryData(["posts", showLatest], (old) =>
        old.filter((item) => item.id !== id)
      );
      setGlobalMsg("An post deleted.");
    },
  });

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
      <Box maxWidth="sm" sx={{ mt: 4 }}>
        {showForm && auth && <Form add={add.mutate} />}
        {auth && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Button disabled={showLatest} onClick={() => setShowLatest(true)}>
              All Posts
            </Button>
            <Typography color="error" sx={{ fontSize: 15 }}>
              |
            </Typography>
            <Button disabled={!showLatest} onClick={() => setShowLatest(false)}>
              Following Posts
            </Button>
          </Box>
        )}

        {data.map((item) => {
          return <Item key={item.id} item={item} remove={remove.mutate} />;
        })}
      </Box>
  );
}
