import { fetchComments } from '@/service/user';
import { useQuery } from '@tanstack/react-query';

interface CommentResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: {
    ticketId: string;
    comments: Array<{
      type: string | null;
      commentId: string;
      createdAt: string;
      memberId: string;
      nickname: string;
      content: string;
      attachments: string[];
    }>;
  };
}

const fetchCommentList = async ({ ticketId }: { ticketId: string }) => {
  const response = await fetchComments(ticketId);
  return response;
};

export const useCommentList = ({ ticketId }: { ticketId: string }) => {
  return useQuery<CommentResponse>({
    queryKey: ['comments', { ticketId }],
    queryFn: () => fetchCommentList({ ticketId }),
    enabled: !!ticketId,
  });
};
