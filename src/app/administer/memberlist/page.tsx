"use client";

export default function AdminMemberListPage() {
  return (
    <div className="flex items-center justify-between bg-white p-4 rounded-md  w-full">
      {/* 필터 버튼 */}
      <div className="flex-shrink-0">
        <button className="flex items-center px-4 py-4 border border-gray-300 rounded-md text-sm hover:bg-gray-100 focus:outline-none">
          Add filter
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* 검색바 */}
      <div className="flex-grow flex items-center bg-gray-100 px-4 py-4 rounded-md text-gray-500 ml-4">
        <img src="/search.png" className="w-5"/>
        <input
          type="text"
          placeholder="Search for teachers by name or email"
          className="w-full bg-transparent text-sm focus:outline-none ml-2"
        />
      </div>
    </div>
  );
}
