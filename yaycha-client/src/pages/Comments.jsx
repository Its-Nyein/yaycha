import { Alert, Box, Button, TextField } from "@mui/material";
import Item from "../components/Item";
import { useQuery, useMutation } from "react-query";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext, queryClient } from "../ThemeApp";
import { useContext, useRef } from "react";
import { postComment } from "../libs/fetcher";

const api = import.meta.env.VITE_API;

export default function Comments() {
  const { id } = useParams();
  const navigate = new useNavigate();
  const { setGlobalMsg, auth } = useContext(AppContext);
  const commentRef = useRef();

  const { isLoading, isError, error, data } = useQuery("comments", async () => {
    const res = await fetch(`${api}/content/posts/${id}`);
    return res.json();
  });

  const removePost = useMutation(async (id) => {
    await fetch(`${api}/content/posts/${id}`, {
      method: "DELETE",
    });
    navigate("/");
    setGlobalMsg("A post deleted");
  });

  const addComment = useMutation(async (content) => postComment(content, id), {
    onSuccess: async (comment) => {
      await queryClient.cancelQueries("comments");
      await queryClient.setQueryData("comments", (old) => {
        old.comments = [...old.comments, comment];
        return { ...old };
      });
    },
  });

  const removeComment = useMutation(
    async (id) => {
      await fetch(`${api}/content/comments/${id}`, {
        method: "DELETE",
      });
    },
    {
      onMutate: (id) => {
        queryClient.cancelMutations("comments");
        queryClient.setQueryData("comments", (item) => {
          item.comments = item.filter((i) => i.id !== id);
          return { ...item };
        });
        setGlobalMsg("A comment deleted");
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
      <Item primary key={1} item={data} remove={removePost.mutate} />
      {data.comments.map((comment) => {
        return <Item key={2} item={comment} remove={removeComment.mutate} />;
      })}

      {auth && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const content = commentRef.current.value;
            if (!content) return false;
            addComment.mutate(content);
            e.currentTarget.reset();
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 3 }}>
            <TextField
              multiline
              placeholder="Your Comment"
              inputRef={commentRef}
            />
            <Button type="submit" variant="contained">
              Reply
            </Button>
          </Box>
        </form>
      )}
    </Box>
  );
}
