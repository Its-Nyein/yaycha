import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContext, useRef, useState } from "react";
import { AppContext } from "../ThemeApp";
import { useMutation } from "react-query";
import { postLogin } from "../libs/fetcher";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AppContext);
  const [error, setError] = useState(null);

  const usernameInput = useRef();
  const passwordInput = useRef();

  const handleSubmit = () => {
    const username = usernameInput.current.value;
    const password = passwordInput.current.value;

    if (!username || !password) {
      setError("Username and password are required");
      return false;
    }

    console.log("login.mutate is calling");
    login.mutate({ username, password });
  };

  const login = useMutation(
    async ({ username, password }) => postLogin(username, password),
    {
      onError: async () => {
        setError("Incorrect username or pasword");
      },
      onSuccess: async (result) => {
        setAuth(result.user);
        localStorage.setItem("token", result.token);
        navigate("/");
      },
    }
  );

  return (
    <Box>
      <Typography variant="h3">Login</Typography>
      {error && (
        <Alert sx={{ mt: 2 }} severity="warning">
          {error}
        </Alert>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 2 }}>
          <TextField
            placeholder="Username"
            fullWidth
            inputRef={usernameInput}
          />
          <TextField
            type="password"
            placeholder="Password"
            fullWidth
            inputRef={passwordInput}
          />
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
        </Box>
      </form>
    </Box>
  );
}
