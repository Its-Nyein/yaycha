import { Alert, Box, Button, TextField } from "@mui/material";
import Item from "../components/Item";
import { useQuery, useMutation } from "react-query";
import { queryClient, useApp } from "../ThemeApp";
import { useNavigate, useParams } from "react-router-dom";
import { postComment } from "../components/libs/fetcher.js";
import { useRef } from "react";

const api = import.meta.env.VITE_API;

const Comments = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const contentInput = useRef();

  const { setGlobalMsg, auth } = useApp();

  const { isLoading, isError, error, data } = useQuery("comments", async () => {
    const res = await fetch(`${api}/content/posts/${id}`);
    return res.json();
  });

  const addcomment = useMutation((content) => postComment(content, id), {
    onSuccess: async (comment) => {
      await queryClient.cancelQueries("comments");
      await queryClient.setQueryData("comments", (old) => {
        old.comments = [...old.comments, comment];
        return { ...old };
      });
      setGlobalMsg("A comment added");
    },
  });

  const removePost = useMutation(async (id) => {
    await fetch(`${api}/content/posts/${id}`, {
      method: "DELETE",
    });
    navigate("/");
    setGlobalMsg("A post deleted.");
  });

  const removeComment = useMutation(
    async (id) => {
      await fetch(`${api}/content/comments/${id}`, {
        method: "DELETE",
      });
    },
    {
      onMutate: (id) => {
        queryClient.cancelQueries("comments");
        queryClient.setQueryData("comments", (old) => {
          old.comments = old.comments.filter((comment) => comment.id !== id);
          return { ...old };
        });
        setGlobalMsg("A comment deleted.");
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
      <Item primary item={data} remove={removePost.mutate} />
      {data?.comments.map((comment) => {
        return (
          <Item
            comment
            key={comment.id}
            item={comment}
            remove={removeComment.mutate}
            owner={data.userId}
          />
        );
      })}
      {auth && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const content = contentInput.current.value;
            if (!content) return false;

            addcomment.mutate({ content, postId: id });
            e.currentTarget.reset();
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              mt: 3,
            }}
          >
            <TextField
              multiline
              placeholder="Your Comment"
              inputRef={contentInput}
            />
            <Button type="submit" variant="contained">
              Reply
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
};

export default Comments;
