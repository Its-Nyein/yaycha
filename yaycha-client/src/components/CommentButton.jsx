import { IconButton, ButtonGroup, Button } from "@mui/material";
import { ChatBubbleOutline as CommentIcon } from "@mui/icons-material";

const CommentButton = ({ item, comment }) => {
  return (
    <>
      {!comment && (
        <ButtonGroup>
          <IconButton size="small">
            <CommentIcon fontSize="small" color="info" />
          </IconButton>
          <Button sx={{ color: "text.fade" }} variant="text" size="small">
            {item.comments.length}
          </Button>
        </ButtonGroup>
      )}
    </>
  );
};

export default CommentButton;
