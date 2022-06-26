import { ProcessedFile } from "@/types";

/**
 * @description 드래그 앤 드롭을 통해 가져온 파일 가공하는 함수
 * @param files input[type="file"] 요소에서 change event 발생시 event.target.files를 그대로 넘김
 * @returns 가공된 파일 리스트
 */
export const getProcessedFilesInExplorer = (
  files: FileList
): ProcessedFile[] => {
  return Array.from(files).map((file) => {
    return {
      file,
      relativePath: file.webkitRelativePath,
    };
  });
};
