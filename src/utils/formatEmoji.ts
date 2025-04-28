/**
 * 格式化消息中的表情符号
 * 将 [em]eXXX[/em] 格式转换为 HTML
 */
export function formatEmoji(content: string): string {
  if (!content) return '';

  // 替换 [em]eXXX[/em] 为 HTML 表情
  return content.replace(/\[em\]e(\d+)\[\/em\]/g, (_, code) => {
    // 这里可以根据实际情况替换为真实的表情图片或 Unicode 表情
    // 示例：返回一个通用的表情符号
    return '😊';
  });
} 