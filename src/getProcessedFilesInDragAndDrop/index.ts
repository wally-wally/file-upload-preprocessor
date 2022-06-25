import { ProcessedFile } from "@/types";

/**
 * @description 드래그 앤 드롭을 통해 가져온 파일 가공하는 함수
 * @param items drop event 발생시 event.dataTransfer.items를 그대로 넘김
 * @returns 가공된 파일 리스트
 */
export const getProcessedFilesInDragAndDrop = (
  items: DataTransferItemList
): ProcessedFile[] => {
  const files: ProcessedFile[] = [];

  /** 폴더 내부에 재귀로 돌면서 파일 추출 */
  const getEntries = (entryInfo: FileSystemDirectoryEntry) => {
    entryInfo.createReader().readEntries((entries) => {
      entries.forEach((entry) => {
        if (entry.isFile) {
          (entry as FileSystemFileEntry).file((file) =>
            files.push({ file, path: entry.fullPath.slice(1) })
          );
          return;
        }

        getEntries(entry as FileSystemDirectoryEntry);
      });
    });
  };

  Array.from(items).forEach((item) => {
    const entryInfo = item.webkitGetAsEntry();

    // prechecker - 아무것도 없는 경우 null 예외 처리
    if (!entryInfo) {
      files.push({ file: null, path: "" });
      return;
    }

    // 파일인 경우
    if (entryInfo.isFile) {
      files.push({ file: item.getAsFile(), path: "" });
      return;
    }

    // 폴더인 경우
    getEntries(entryInfo as FileSystemDirectoryEntry);
  });

  return files;
};
