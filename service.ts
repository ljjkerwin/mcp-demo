export function predictFortune(name: string, date: string): string {
  // 你原有的预测逻辑，这里只是示例
  const fortunes = ["大吉", "大大吉", "大大吉ProMax", "大大吉Ultra"];
  const index = Math.floor(Math.random() * fortunes.length);
  return `${name} 今日运势：${fortunes[index]}，诸事顺遂，出行大利。`;
}