const apiUrl = import.meta.env.VITE_API_URL_BACKEND;
console.log(apiUrl);

const getItems = async () => {
  const response = await fetch(`${apiUrl}/items`);
  if (!response.ok) {
    throw new Error("Failed to fetch items");
  }
  return await response.json();
};

const setItem = async (item) => {
  const response = await fetch(`${apiUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });
  if (!response.ok) {
    throw new Error("Failed to set item");
  }
};

const getImages = async (img) => {
  const response = await fetch(`${apiUrl}/upload/${img}`);
  if (!response.ok) {
    throw new Error("Failed to fetch images");
  }
};

const deleteItem = async (id) => {
  const response = await fetch(`${apiUrl}/items/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete item");
  }
};

const uploadFile = async (file) => {
  const frrmData = new FormData();
  frrmData.append("file", file);
  const response = await fetch(`${apiUrl}/upload`, {
    method: "POST",
    body: frrmData,
  });
  if (!response.ok) {
    throw new Error("Failed to upload file");
  }
  console.log("File uploaded");
};

const saveOrUpdateUser = async (user) => {
  const response = await fetch(`${apiUrl}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Failed to save or update user");
  }

  return await response.json();
};

// // GET: login user
// const loginUser = async (user) => {
//   const response = await fetch(`${apiUrl}/users/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   });
//   console.log("BODY", user);

//   if (!response.ok) {
//     throw new Error("Failed to login user");
//   }

//   console.log("RESPONSE", response.body);
//   return await response.json();
// };

export default {
  getItems,
  setItem,
  deleteItem,
  uploadFile,
  getImages,
  saveOrUpdateUser,
  // loginUser,
};
