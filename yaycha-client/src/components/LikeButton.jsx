import { IconButton, ButtonGroup, Button } from "@mui/material";
import {
  Favorite as LikedIcon,
  FavoriteBorder as LikeIcon,
} from "@mui/icons-material";
import { useApp, queryClient } from "../ThemeApp";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import {
  postPostLikes,
  postCommentLikes,
  deletePostLikes,
  deleteCommentLikes,
} from "./libs/fetcher";

const LikeButton = ({ item, comment }) => {
  const navigate = useNavigate();
  const { auth } = useApp();

  function isLiked() {
    if (!auth) return false;
    if (!item.likes) return false;

    return item.likes.find((like) => like.userId === auth.id);
  }

  // instead of refetchQuery should update latest on client side
  const likePost = useMutation((id) => postPostLikes(id), {
    onSuccess: () => {
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });

  const likeComment = useMutation((id) => postCommentLikes(id), {
    onSuccess: () => {
      queryClient.refetchQueries("comments");
    },
  });

  const unlikePost = useMutation((id) => deletePostLikes(id), {
    onSuccess: () => {
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });

  const unlikeComment = useMutation((id) => deleteCommentLikes(id), {
    onSuccess: () => {
      queryClient.refetchQueries("comments");
    },
  });

  return (
    <ButtonGroup>
      {isLiked() ? (
        <IconButton
          size="small"
          onClick={(e) => {
            comment
              ? unlikeComment.mutate(item.id)
              : unlikePost.mutate(item.id);
            e.stopPropagation();
          }}
        >
          <LikedIcon fontSize="small" color="error" />
        </IconButton>
      ) : (
        <IconButton
          size="small"
          onClick={(e) => {
            comment ? likeComment.mutate(item.id) : likePost.mutate(item.id);
            e.stopPropagation();
          }}
        >
          <LikeIcon fontSize="small" color="error" />
        </IconButton>
      )}
      <Button
        onClick={(e) => {
          if (comment) {
            navigate(`/likes/${item.id}/comment`);
          } else {
            navigate(`/likes/${item.id}/post`);
          }
          e.stopPropagation();
        }}
        sx={{ color: "text.fade" }}
        variant="text"
        size="small"
      >
        {item.likes ? item.likes.length : 0}
      </Button>
    </ButtonGroup>
  );
};

export default LikeButton;
