"use client";

import React, { useState } from "react";

interface FileItem {
  id: string;
  file: File;
}

const FileBox: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // ✅ 드래그 앤 드롭 파일 처리
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const newFiles = Array.from(event.dataTransfer.files).map((file) => ({
      id: crypto.randomUUID(), // 유니크한 ID 생성
      file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // ✅ 파일 선택 시 처리
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFiles = Array.from(event.target.files).map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  // ✅ 파일 삭제
  const handleRemoveFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ✅ 드래그 앤 드롭 영역 */}
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
        <input
          type="file"
          multiple
          className="hidden"
          id="fileInput"
          onChange={handleFileSelect}
        />
        <label
          htmlFor="fileInput"
          className="mt-2 inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
        >
          파일 선택
        </label>
      </div>

      {/* ✅ 업로드된 파일 목록 */}
      {files.length > 0 && (
        <ul className="mt-4 rounded-md p-3">
          {files.map(({ id, file }) => (
            <li key={id} className="flex justify-between items-center border-b last:border-none p-2">
              <span className="text-gray-700 text-sm">{file.name}</span>
              <button
                className="text-red-500 hover:text-red-700 text-xs"
                onClick={() => handleRemoveFile(id)}
              >
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
