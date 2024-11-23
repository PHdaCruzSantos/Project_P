const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiUrl}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  console.log("File uploaded");
};

export default {
  uploadFile,
};
