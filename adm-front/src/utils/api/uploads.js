const apiUrl = import.meta.env.VITE_API_URL_BACKEND;

const uploadFiles = async (file) => {
  const formData = new FormData();

  // Handle single file upload
  if (file && file.length > 0) {
    formData.append("files", file[0]); // Get first file from FileList
  } else {
    throw new Error("No file provided");
  }

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
