// test
export const getProcessedFilesInExplorer = (files: FileList) => {
  return Array.from(files).map((file) => {
    return {
      file,
      path: "",
    };
  });
};
