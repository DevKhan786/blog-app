import DOMPurify from 'dompurify';

export const sanitizeHTML = (html: string) => {
  if (typeof window !== 'undefined') {
    return DOMPurify.sanitize(html);
  }
  return html;
};