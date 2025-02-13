async function createFilesFromUrls(urls: string[]): Promise<File[]> {
  const files: File[] = [];

  for (const url of urls) {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileName = url.split("/").pop() || "file";
    const file = new File([blob], fileName, { type: blob.type });
    files.push(file);
  }

  return files;
}

export const FilesHelpers = {
  createFilesFromUrls,
};
