import { Alert, Avatar, Box, Button, Typography } from "@mui/material";
import { pink } from "@mui/material/colors";
import {
  deleteFollow,
  fetchUser,
  postFollow,
} from "../components/libs/fetcher.js";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { useApp, queryClient } from "../ThemeApp";

const Profile = () => {
  const { auth } = useApp();
  const { id } = useParams();
  // refetch everytime change users or id
  const { isLoading, isError, error, data } = useQuery(
    ["users", id],
    async () => fetchUser(id)
  );

  function isFollowing() {
    return data.following.find((u) => u.followerId === auth.id);
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
      <Box sx={{ bgcolor: "banner", height: 150, borderRadius: 4 }}></Box>
      <Box
        sx={{
          mb: 4,
          marginTop: "-60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Avatar sx={{ width: 100, height: 100, bgcolor: pink[500] }} />
        <Box sx={{ textAlign: "center" }}>
          <Typography>{data.name}</Typography>
          <Typography sx={{ fontSize: "0.8em", color: "text.fade" }}>
            {data.bio}
          </Typography>
          <Button
            size="small"
            variant={isFollowing() ? "outlined" : "contained"}
            sx={{ borderRadius: 5, marginLeft: "auto", mt: 4 }}
            onClick={(e) => {
              if (isFollowing()) {
                unfollow.mutate(data.id);
              } else {
                follow.mutate(data.id);
              }
              e.stopPropagation();
            }}
          >
            {isFollowing() ? "Following" : "Follow"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
