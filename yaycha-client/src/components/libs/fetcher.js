const api = import.meta.env.VITE_API;

function getToken() {
  return localStorage.getItem("token");
}

export async function postUser(data) {
  const res = await fetch(`${api}/users`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json();
  }

  throw new Error("Error: Check network log");
}

export async function postLogin(username, password) {
  const res = await fetch(`${api}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res.ok) {
    return res.json();
  }

  throw new Error("Incorrect username or password");
}

export async function fetchUser(id) {
  const token = getToken();

  const res = await fetch(`${api}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function fetchVerify() {
  const token = getToken();

  const res = await fetch(`${api}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.ok) {
    return res.json();
  }

  return false;
}

export async function postPost(content) {
  const token = getToken();

  const res = await fetch(`${api}/content/posts`, {
    method: "POST",
    body: JSON.stringify({ content }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Beareer ${token}`,
    },
  });

  if (res.ok) {
    return res.json();
  }

  throw new Error("Error: Check network log");
}

export async function postComment({ content, postId }) {
  const token = getToken();

  const res = await fetch(`${api}/content/comments`, {
    method: "POST",
    body: JSON.stringify({ content, postId }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Beareer ${token}`,
    },
  });

  if (res.ok) {
    return res.json();
  }

  throw new Error("Error: Check network log");
}

export async function postPostLikes(id) {
  const token = getToken();

  const res = await fetch(`${api}/content/like/posts/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function postCommentLikes(id) {
  const token = getToken();

  const res = await fetch(`${api}/content/like/comments/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function deletePostLikes(id) {
  const token = getToken();

  const res = await fetch(`${api}/content/unlike/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function deleteCommentLikes(id) {
  const token = getToken();

  const res = await fetch(`${api}/content/unlike/comments/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function fetchPostLikes(id) {
  const res = await fetch(`${api}/content/likes/posts/${id}`);
  return res.json();
}

export async function fetchCommentLikes(id) {
  const res = await fetch(`${api}/content/likes/comments/${id}`);
  return res.json();
}

export async function postFollow(id) {
  const token = getToken();

  const res = await fetch(`${api}/follow/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function deleteFollow(id) {
  const token = getToken();

  const res = await fetch(`${api}/unfollow/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function fetchSearch(q) {
  const res = await fetch(`${api}/search?q=${q}`);
  return res.json();
}

export async function fetchFollowingPosts() {
  const token = getToken();

  const res = await fetch(`${api}/content/following/posts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
}

export async function deletePost(id) {
  const token = getToken();
  const res = await fetch(`${api}/content/posts/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.text();
}

export async function fetchAllPosts() {
  const res = await fetch(`${api}/content/posts`);
  return res.json();
}
