const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const uploadFile = async (file) => {
  // Check if file exists in @upload folder
  try {
    const checkResponse = await fetch(`${apiUrl}/upload/images/${file.name}`);
    if (checkResponse.ok) {
      return { message: "File already exists" };
    }
  } catch (error) {
    console.log("File not found in uploads, proceeding with upload");
  }

  // Upload file if not found
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${apiUrl}/upload/add-image`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload file");
  }

  const text = await response.text();
  return { message: text };
};

export default {
  uploadFile,
};
