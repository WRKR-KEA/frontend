export function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!text) return <span>{text || ""}</span>; // 🔹 null일 경우 빈 문자열로 처리

  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="bg-[#252E66] bg-opacity-30 font-bold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  }