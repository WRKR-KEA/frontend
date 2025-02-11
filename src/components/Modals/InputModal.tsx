import React, { useState } from 'react';
import InputModal from './InputModal';

interface NameInputModalProps {
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function NameInputModal({ onClose, onSubmit }: NameInputModalProps) {
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit(name);
      onClose();
    }
  };

  return (
    <InputModal onClose={onClose}>
      <h2 className="text-lg font-semibold mb-4">이름을 입력하세요</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="이름을 입력하세요"
      />
      <div className="flex justify-end mt-4">
        <button
          onClick={onClose}
          className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
        >
          취소
        </button>
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          확인
        </button>
      </div>
    </InputModal>
  );
}
