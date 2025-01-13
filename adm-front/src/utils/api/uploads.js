const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const uploadFiles = async (files) => {
  const formData = new FormData();

  // Add each file to formData
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`${apiUrl}/upload/add-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload files");
  }

  return await response.json();
};

export default {
  uploadFiles,
};
