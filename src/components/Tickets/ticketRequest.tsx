export default function TicketRequest({ ticket }) {
  return (
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold mb-2">요청 내용</h2>
      <div className="bg-gray-100 p-4 rounded-md">
        <p><strong>제목:</strong> {ticket.title}</p>
        <p><strong>내용:</strong> {ticket.content}</p>
        <p><strong>요청자:</strong> {ticket.requester}</p>
        <p><strong>요청일:</strong> {ticket.requestDate}</p>
      </div>
    </div>
  );
}