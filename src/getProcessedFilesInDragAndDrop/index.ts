import { ProcessedFile } from "@/types";

let getProcessedFilesInDragAndDropTimerID: ReturnType<
  typeof setTimeout
> | null = null;

/**
 * @description 드래그 앤 드롭을 통해 가져온 파일들을 가공하는 함수
 * @param items drop event 발생시 event.dataTransfer.items를 그대로 넘김
 * @returns 가공된 파일 리스트
 */
export const getProcessedFilesInDragAndDrop = async (
  items: DataTransferItemList
): Promise<ProcessedFile[]> => {
  return new Promise((resolve) => {
    const files: ProcessedFile[] = [];

    /** 비동기로 폴더 내부를 재귀 + 순회하면서 모든 파일들을 추출 */
    const readEntriesAsync = (
      reader: FileSystemDirectoryReader
    ): Promise<FileSystemEntry[]> => {
      return new Promise((resolve) => {
        reader.readEntries(async (entries) => {
          for await (const entry of entries) {
            if (entry.isFile) {
              (entry as FileSystemFileEntry).file((file) =>
                files.push({ file, relativePath: entry.fullPath.slice(1) })
              );
              continue;
            }

            await getEntries(entry as FileSystemDirectoryEntry);
          }
          resolve(entries);
        });
      });
    };

    /** 폴더 내부에 있는 모든 파일 or 폴더 정보 추출 */
    const getEntries = async (directoryEntry: FileSystemDirectoryEntry) => {
      const reader = directoryEntry.createReader();

      const readEntries = async () => {
        const entries = await readEntriesAsync(reader);
        if (entries.length > 0) {
          await readEntries();
        }
      };

      await readEntries();
    };

    for (const item of Array.from(items)) {
      const entry = item.webkitGetAsEntry();

      // prechecker - 아무것도 없는 경우 null 예외 처리
      if (!entry) {
        files.push({ file: null, relativePath: "" });
        continue;
      }

      // 파일인 경우
      if (entry.isFile) {
        files.push({ file: item.getAsFile(), relativePath: entry.name });
        continue;
      }

      // 폴더인 경우
      getEntries(entry as FileSystemDirectoryEntry);
    }

    if (getProcessedFilesInDragAndDropTimerID) {
      clearTimeout(getProcessedFilesInDragAndDropTimerID);
    }

    getProcessedFilesInDragAndDropTimerID = setTimeout(
      () => resolve(files),
      1000
    );
  });
};
