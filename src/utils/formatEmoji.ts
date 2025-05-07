const emojiMap: Record<string, string> = {
  'e400198': '/qq-imgs/e400198@2x.webp',
  'e400866': '/qq-imgs/e400866.webp',
  'e401181': '/qq-imgs/e401181.webp',
  'e400851': '/qq-imgs/e400851.webp',
  'e400849': '/qq-imgs/e400849.webp',
  'e400850': '/qq-imgs/e400850.webp',
  'e400836': '/qq-imgs/e400836.webp',
  'e400832': '/qq-imgs/e400832.webp',
  'e400833': '/qq-imgs/e400833.webp',
  'e400829': '/qq-imgs/e400829.webp',
  'e400831': '/qq-imgs/e400831.webp',
  'e400827': '/qq-imgs/e400827.webp',
  'e400828': '/qq-imgs/e400828.webp',
  'e400826': '/qq-imgs/e400826.webp',
  'e400823': '/qq-imgs/e400823.webp',
  'e400825': '/qq-imgs/e400825.webp',
  'e400562': '/qq-imgs/e400562@2x.webp',
  'e400822': '/qq-imgs/e400822.webp',
  'e4005': '/qq-imgs/e4005.gif',
  'e400188': '/qq-imgs/e400188@2x.webp',
  'e400186': '/qq-imgs/e400186@2x.webp',
  'e400083': '/qq-imgs/e400083@2x.png',
  'e328531': '/qq-imgs/e328531.webp',
  'e328513': '/qq-imgs/e328513.webp',
  'e213': '/qq-imgs/e213@2x.gif',
  'e198': '/qq-imgs/e198@2x.gif',
  'e197': '/qq-imgs/e197@2x.gif',
  'e195': '/qq-imgs/e195@2x.gif',
  'e194': '/qq-imgs/e194@2x.gif',
  'e192': '/qq-imgs/e192.gif',
  'e173': '/qq-imgs/e173@2x.gif',
  'e144': '/qq-imgs/e144@2x.gif',
  'e142': '/qq-imgs/e142@2x.gif',
  'e141': '/qq-imgs/e141.gif',
  'e129': '/qq-imgs/e129@2x.gif',
  'e128': '/qq-imgs/e128@2x.gif',
  'e113': '/qq-imgs/e113@2x.gif',
  'e112': '/qq-imgs/e112@2x.gif',
  'e104': '/qq-imgs/e104@2x.gif',
  'e1006': '/qq-imgs/e1006@2x.gif',
  'e4018': '/qq-imgs/e4018.gif'
}


/**
 * 格式化消息中的表情符号
 * 将 [em]eXXX[/em] 格式转换为 HTML 图片标签
 * 如果在 emojiMap 中未找到匹配，则显示❎符号
 */
export function formatEmoji(content: string): string {
  if (!content) return '';

  // 去除前后空格
  const trimmedContent = content.trim();
  // console.log('content', trimmedContent);

  // 替换 [em]eXXX[/em] 为 HTML 表情图片
  return trimmedContent.replace(/\[em\]e(\d+)\[\/em\]/g, (_, code) => {
    const emojiKey = `e${code}`;

    // 检查是否在 emojiMap 中存在该表情
    if (emojiMap[emojiKey]) {
      // 返回对应的表情图片标签
      return `<img 
        src="${emojiMap[emojiKey]}" 
        alt="表情" 
        class="inline-block align-middle" 
        style="height: 1.5em; width: auto;" 
      />`;
    } else {
      // 未找到匹配的表情，返回❎符号
      return '❎';
    }
  });
} 