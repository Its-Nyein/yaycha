import { Button } from "@mui/material";
import { useMutation } from "react-query";
import { useApp, queryClient } from "../ThemeApp";
import { postFollow, deleteFollow } from "./libs/fetcher";

const FollowButton = ({ user }) => {
  const { auth } = useApp();
  if (!auth) return <></>;

  function isFollowing() {
    return user.following.find((u) => u.followerId === auth.id);
  }

  const follow = useMutation((id) => postFollow(id), {
    onSuccess: async () => {
      await queryClient.refetchQueries("user");
      await queryClient.refetchQueries("users");
      await queryClient.refetchQueries("search");
    },
  });

  const unfollow = useMutation((id) => deleteFollow(id), {
    onSuccess: async () => {
      await queryClient.refetchQueries("user");
      await queryClient.refetchQueries("users");
      await queryClient.refetchQueries("search");
    },
  });

  return auth.id === user.id ? (
    <></>
  ) : (
    <Button
      size="small"
      variant={isFollowing() ? "outlined" : "contained"}
      sx={{ borderRadius: 5, marginLeft: "auto" }}
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
