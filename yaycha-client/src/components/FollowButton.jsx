import { Button } from "@mui/material";
import { useMutation } from "react-query";
import { queryClient } from "../ThemeApp";
import { postFollow, deleteFollow } from "../libs/fetcher";
import { useContext } from "react";
import { AppContext } from "../ThemeApp";

const FollowButton = ({ user }) => {
  const { auth } = useContext(AppContext);

  function isFollowing() {
    return user.following.find((u) => u.followerId == auth.id);
  }

  const follow = useMutation(
    (id) => {
      return postFollow(id);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries("users");
        await queryClient.refetchQueries("user");
        await queryClient.refetchQueries("searrch");
      },
    }
  );

  const unfollow = useMutation(
    (id) => {
      return deleteFollow(id);
    },
    {
      onSuccess: async () => {
        await queryClient.refetchQueries("users");
        await queryClient.refetchQueries("user");
        await queryClient.refetchQueries("searrch");
      },
    }
  );

  return auth.id === user.id ? (
    <></>
  ) : (
    <Button
      size="small"
      edge="end"
      variant={isFollowing ? "outlined" : "contained"}
      sx={{ borderRadius: 5 }}
      onClick={(e) => {
        if (isFollowing()) {
          unfollow.mutate(user.id);
        } else {
          follow.mutate(user.id);
        }
        e.stopPropagation();
      }}
    >
      {isFollowing() ? "Following" : "Follow"}
    </Button>
  );
};

export default FollowButton;
