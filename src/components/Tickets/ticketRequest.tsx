import React, { useEffect, useState } from "react";
import { remark } from "remark";
import html from "remark-html";

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  const htmlString = result.toString();

  const styledHtml = htmlString
    .replace(/<h1>/g, '<h1 class="text-2xl font-bold my-4">')
    .replace(/<h2>/g, '<h2 class="text-xl font-semibold my-3">')
    .replace(/<h3>/g, '<h3 class="text-lg font-semibold my-2">')
    .replace(/<ul>/g, '<ul class="list-disc pl-5 my-2">')
    .replace(/<ol>/g, '<ol class="list-decimal pl-5 my-2">')
    .replace(/<li>/g, '<li class="my-1">')
    .replace(/<a href="/g, '<a href="/" class="text-blue-600 hover:underline"')
    .replace(/<p>/g, '<p class="text-base leading-relaxed my-2">')
    .replace(/<strong>/g, '<strong class="font-bold">')
    .replace(/<em>/g, '<em class="italic">')
    .replace(/<code>/g, '<code class="bg-gray-200 text-sm px-1 rounded">')
    .replace(/<pre>/g, '<pre class="bg-gray-800 text-white p-3 rounded-md overflow-auto">')
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-400 pl-4 italic my-3">')
    .replace(/<hr>/g, '<hr class="border-t-2 border-gray-300 my-4" />')
    .replace(/<table>/g, '<table class="table-auto w-full border-collapse my-3">')
    .replace(/<th>/g, '<th class="px-4 py-2 border-b text-left bg-gray-100">')
    .replace(/<td>/g, '<td class="px-4 py-2 border-b">')
    .replace(/<tr>/g, '<tr class="odd:bg-gray-50">');

  return styledHtml;
}

interface TicketRequestProps {
  ticket: {
    title: string;
    content: string;
  };
}

export default function TicketRequest({ ticket }: TicketRequestProps) {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      const html = await markdownToHtml(ticket.content);
      setHtmlContent(html);
    };

    convertMarkdownToHtml();
  }, [ticket.content]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">요청 내용</h2>
      <div className="bg-component p-4 rounded-md h-full">
        <h3 className="text-lg font-bold mb-2">{ticket.title}</h3>
        <hr className="border-t-2 border-main-2 my-2" /> 
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}