import { IconButton, ButtonGroup, Button } from "@mui/material";
import {
  Favorite as LikedIcon,
  FavoriteBorder as LikeIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../ThemeApp";
import { useMutation } from "react-query";
import {
  postPostLike,
  deletePostLike,
  postCommentLike,
  deleteCommentLike,
} from "../libs/fetcher";
import { useContext } from "react";
import { AppContext } from "../ThemeApp";

const LikeButton = ({ item, comment }) => {
  const navigate = useNavigate();
  const { auth } = useContext(AppContext);

  function isLiked() {
    if (!auth) return false;
    if (!item.likes) return false;

    return item.likes.find((like) => like.userId === auth.id);
  }

  const likePost = useMutation((id) => postPostLike(id), {
    onSuccess: () => {
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });

  const likeComment = useMutation((id) => postCommentLike(id), {
    onSuccess: () => {
      queryClient.refetchQueries("comments");
    },
  });

  const unlikePost = useMutation((id) => deletePostLike(id), {
    onSuccess: () => {
      queryClient.refetchQueries("posts");
      queryClient.refetchQueries("comments");
    },
  });

  const unlikeComment = useMutation((id) => deleteCommentLike(id), {
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
          <LikeIcon fontSize="small" color="error" />
        </IconButton>
      ) : (
        <IconButton
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
            navigate(`/like/${item.id}/comment`);
          } else {
            navigate(`/like/${item.id}/post`);
          }
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
