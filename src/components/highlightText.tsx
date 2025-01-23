export function HighlightText({ text, highlight }: { text: string; highlight: string }) {
    if (!highlight) return <span>{text}</span>;
  
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
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