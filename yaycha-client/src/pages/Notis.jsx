import {
  Alert,
  Box,
  Card,
  Avatar,
  Button,
  Typography,
  CardContent,
  CardActionArea,
} from "@mui/material";
import {
  Comment as CommentIcon,
  Favorite as FavoriteIcon,
} from "@mui/icons-material";
import { useMutation, useQuery } from "react-query";
import {
  fetchNotis,
  putAllReadNotis,
  putReadNoties,
} from "../components/libs/fetcher.js";
import { useNavigate } from "react-router-dom";
import { queryClient } from "../ThemeApp";
import { format } from "date-fns";

const Notis = () => {
  const navigate = useNavigate();
  const { isLoading, isError, error, data } = useQuery("notis", fetchNotis);

  const readAllNotis = useMutation(putAllReadNotis, {
    onMutate: async () => {
      await queryClient.cancelQueries("notis");
      await queryClient.setQueryData("notis", (old) => {
        return old.map((noti) => {
          noti.read = true;
          return noti;
        });
      });
    },
  });

  const readNoti = useMutation((id) => putReadNoties(id));

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
      <Box sx={{ display: "flex", mb: 2 }}>
        <Box sx={{ flex: 1 }}></Box>
        <Button
          size="small"
          variant="outlined"
          sx={{ borderRadius: 5 }}
          onClick={() => {
            readAllNotis.mutate();
          }}
        >
          Mark all as read
        </Button>
      </Box>
      {data.map((noti) => {
        return (
          <Card sx={{ mb: 2, opacity: noti.read ? 0.3 : 1 }} key={noti.id}>
            <CardActionArea
              onClick={() => {
                readNoti.mutate(noti.id);
                navigate(`/comments/${noti.postId}`);
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  opacity: 1,
                }}
              >
                {noti.type == "comment" ? (
                  <CommentIcon color="success" />
                ) : (
                  <FavoriteIcon color="error" />
                )}
                <Box sx={{ ml: 3 }}>
                  <Avatar />
                  <Box sx={{ mt: 1 }}>
                    <Typography component="span" sx={{ mr: 1 }}>
                      <b>{noti.user.name}</b>
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        mr: 1,
                        color: "text.secondary",
                      }}
                    >
                      {noti.content}
                    </Typography>
                    <Typography component="span" color="primary">
                      <small>{format(noti.createdAt, "MMM dd, yyyy")}</small>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
};

export default Notis;
