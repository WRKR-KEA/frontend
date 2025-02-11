import React, { useEffect, useState } from "react";
import { remark } from 'remark';
import html from 'remark-html';

async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  const htmlString = result.toString();

  const styledHtml = htmlString
    .replace(/<h1>/g, '<h1 class="text-4xl font-bold my-6">')
    .replace(/<h2>/g, '<h2 class="text-3xl font-semibold my-5">')
    .replace(/<h3>/g, '<h3 class="text-2xl font-semibold my-4">')
    .replace(/<h4>/g, '<h4 class="text-xl font-medium my-3">')
    .replace(/<h5>/g, '<h5 class="text-lg font-medium my-2">')
    .replace(/<h6>/g, '<h6 class="text-base font-medium my-1">')
    .replace(/<ul>/g, '<ul class="list-disc pl-6 my-2">')
    .replace(/<ol>/g, '<ol class="list-decimal pl-6 my-2">')
    .replace(/<li>/g, '<li class="my-1">')
    .replace(/<a href="/g, '<a href="/" class="text-indigo-600 hover:underline"') // 링크 스타일링
    .replace(/<p>/g, '<p class="text-base leading-relaxed my-3">') // p 태그 스타일링
    .replace(/<strong>/g, '<strong class="font-bold">') // strong 태그 스타일링
    .replace(/<em>/g, '<em class="italic">') // em 태그 스타일링
    .replace(/<code>/g, '<code class="bg-gray-100 text-sm p-1 rounded-md">') // code 태그 스타일링
    .replace(/<pre>/g, '<pre class="bg-gray-800 text-white p-4 rounded-md overflow-auto">') // pre 태그 스타일링
    .replace(/<blockquote>/g, '<blockquote class="border-l-4 border-gray-500 pl-4 italic my-4">') // blockquote 스타일링
    .replace(/<img>/g, '<img class="max-w-full h-auto rounded-lg my-4" />') // 이미지 스타일링
    .replace(/<hr>/g, '<hr class="border-t-2 border-gray-300 my-6" />') // hr 스타일링
    .replace(/<table>/g, '<table class="table-auto w-full border-collapse my-4">') // 테이블 스타일링
    .replace(/<th>/g, '<th class="px-4 py-2 border-b text-left">') // 테이블 헤더 스타일링
    .replace(/<td>/g, '<td class="px-4 py-2 border-b">') // 테이블 데이터 스타일링
    .replace(/<tr>/g, '<tr class="odd:bg-gray-100">'); // 테이블 행 스타일링

  return styledHtml;
}

interface HelpProps {
  title: string;
  content: string;
}

const Help: React.FC<HelpProps> = ({ title, content }) => {
  const [htmlContent, setHtmlContent] = useState<string>("");

  useEffect(() => {
    const convertMarkdownToHtml = async () => {
      const html = await markdownToHtml(content);
      setHtmlContent(html);
    };
    
    convertMarkdownToHtml();
  }, [content]);

  return (
    <div>
      <h2 className="text-lg font-bold">{title}</h2>
      <div
        className="text-sm mt-2"
        dangerouslySetInnerHTML={{ __html: htmlContent }} 
      />
    </div>
  );
};

export default Help;