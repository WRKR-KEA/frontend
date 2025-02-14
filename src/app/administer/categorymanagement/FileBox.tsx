"use client";

import React, { useEffect, useState } from "react";

interface FileBoxProps {
  onFileUpload: (files: File[]) => void; // ✅ 부모 컴포넌트에 파일 전달
  attachments: string[]; // ✅ 기존 파일 URL 리스트 추가
  setDeleteAttachments: (deletedUrls: string[]) => void; // ✅ 삭제된 파일 URL 저장 함수
}

const FileBox: React.FC<FileBoxProps> = ({ onFileUpload, attachments, setDeleteAttachments }) => {

  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]); // ✅ 기존 파일 URL 저장
  const [isDragging, setIsDragging] = useState(false);
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]); // ✅ 삭제된 URL 저장

  console.log("attachments", attachments);

  // ✅ 컴포넌트 마운트 시 attachments를 fileUrls 상태에 저장
  useEffect(() => {
    if (attachments?.length > 0) {
      setFileUrls(attachments);
    }
  }, [attachments]);

  // ✅ 파일 삭제될 때마다 부모 컴포넌트에 삭제된 URL 전달
  useEffect(() => {
    setDeleteAttachments(deletedUrls);
  }, [deletedUrls, setDeleteAttachments]);

  console.log("attachments", attachments);

  // ✅ 컴포넌트 마운트 시 attachments를 fileUrls 상태에 저장
  useEffect(() => {
    if (attachments?.length > 0) {
      setFileUrls(attachments);
    }
  }, [attachments]);

  // ✅ 드래그 앤 드롭 파일 처리
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const newFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onFileUpload([...files, ...newFiles]); // ✅ 부모 컴포넌트에 파일 전달
  };

  // ✅ 파일 선택 시 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onFileUpload([...files, ...newFiles]); // ✅ 부모 컴포넌트에 파일 전달
  };

  // ✅ 파일 삭제 (업로드된 파일 & 기존 URL 파일 처리)
  const handleRemoveFile = (index: number, isUrl = false) => {
    if (isUrl) {

      const deletedFileUrl = fileUrls[index];
      const updatedUrls = fileUrls.filter((_, i) => i !== index);
      setFileUrls(updatedUrls);
      setDeletedUrls((prev) => [...prev, deletedFileUrl]); // ✅ 삭제된 파일 URL 저장

    } else {
      const updatedFiles = files.filter((_, i) => i !== index);
      setFiles(updatedFiles);
      onFileUpload(updatedFiles);
    }
  };

  // ✅ URL에서 파일명만 추출하는 함수
  const extractFileName = (url: string) => {
    const fileName = decodeURIComponent(url.split("/").pop()?.split("?")[0] || "파일");
    // ✅ UUID 패턴 (8-4-4-4-12) 탐색 및 제거
    return fileName.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/, '');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-md p-6 text-center ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <p className="text-gray-600">파일을 여기로 드래그하거나 클릭하여 선택하세요.</p>
        <p className="text-xs text-gray-400 mt-1">첨부파일(jpg, jpeg, png, pdf, xls, xlsx만 허용)은 최대 5개까지 각각 최대 10MB 까지 가능합니다.</p>
        <input type="file" multiple className="hidden" id="fileInput" onChange={handleFileSelect} />
        <label
          htmlFor="fileInput"
          className="mt-2 inline-block cursor-pointer bg-main-1 text-white px-4 py-2 rounded-md text-sm hover:bg-main-hover"
        >
          파일 선택
        </label>
      </div>

      {/* 파일 리스트 출력 (업로드된 파일 + 기존 URL 파일) */}
      {(files.length > 0 || fileUrls.length > 0) && (
        <ul className="mt-4 rounded-md px-3">
          {/* ✅ 기존 URL 파일 리스트 */}
          {fileUrls.map((url, index) => (
            <li key={`url-${index}`} className="flex justify-between items-center border-b last:border-none p-2">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm">
                {extractFileName(url)} {/* 파일명만 표시 */}
              </a>
              <button
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={() => handleRemoveFile(index, true)}
              >
                삭제
              </button>
            </li>
          ))}

          {/* ✅ 새롭게 추가한 파일 리스트 */}
          {files.map((file, index) => (
            <li key={`file-${index}`} className="flex justify-between items-center border-b last:border-none p-2">
              <span className="text-gray-700 text-sm truncate">{file.name}</span>
              <button className="text-red-500 min-w-6 hover:text-red-700 text-xs" onClick={() => handleRemoveFile(index)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileBox;
