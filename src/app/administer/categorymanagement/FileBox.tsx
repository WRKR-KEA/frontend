"use client";

import React, { useState } from "react";

interface FileBoxProps {
  onFileUpload: (files: File[]) => void; // ✅ 부모 컴포넌트에 파일 전달
}

const FileBox: React.FC<FileBoxProps> = ({ onFileUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

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

  // ✅ 파일 삭제
  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFileUpload(updatedFiles); // ✅ 부모 컴포넌트에 업데이트된 파일 전달
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
        <input type="file" multiple className="hidden" id="fileInput" onChange={handleFileSelect} />
        <label
          htmlFor="fileInput"
          className="mt-2 inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
        >
          파일 선택
        </label>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 rounded-md p-3">
          {files.map((file, index) => (
            <li key={index} className="flex justify-between items-center border-b last:border-none p-2">
              <span className="text-gray-700 text-sm">{file.name}</span>
              <button className="text-red-500 hover:text-red-700 text-xs" onClick={() => handleRemoveFile(index)}>
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
