export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-5xl font-extrabold text-red-600">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 mt-2">페이지를 찾을 수 없습니다</h2>
      <p className="mt-2 text-gray-600">요청하신 페이지가 존재하지 않습니다.</p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
      >
        홈으로 돌아가기
      </a>
    </div>
  );
}
