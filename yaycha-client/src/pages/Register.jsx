import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import { useRef, useState } from "react";
import { useMutation } from "react-query";
import { postUser } from "../components/libs/fetcher.js";
import { useNavigate } from "react-router-dom";
import { useApp } from "../ThemeApp.jsx";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const { setGlobalMsg } = useApp();
  const nameInput = useRef();
  const usernameInput = useRef();
  const bioInput = useRef();
  const passwordInput = useRef();

  const handleSubmit = () => {
    const name = nameInput.current.value;
    const username = usernameInput.current.value;
    const bio = bioInput.current.value;
    const password = passwordInput.current.value;

    if (!name || !username || !password) {
      setError("Name, username and password are required.");
      return false;
    }

    create.mutate({ name, username, bio, password });
  };

  const create = useMutation(async (data) => postUser(data), {
    onError: async () => {
      setError("Cannot create account.");
    },
    onSuccess: async () => {
      setGlobalMsg("Account created successfully");
      navigate("/login");
    },
  });

  return (
    <Box>
      <Typography variant="h3">Register</Typography>
      {error && (
        <Alert severity="warning" sx={{ mt: 2 }}>
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
          <TextField placeholder="Name" fullWidth inputRef={nameInput} />
          <TextField
            placeholder="Username"
            fullWidth
            inputRef={usernameInput}
          />
          <TextField placeholder="Bio" fullWidth inputRef={bioInput} />
          <TextField
            type="password"
            placeholder="Password"
            fullWidth
            inputRef={passwordInput}
          />
          <Button type="submit" variant="contained" fullWidth>
            Register
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Register;
