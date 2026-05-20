export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY 尚未設定，請先到 Vercel Environment Variables 新增。' });
  }

  const form = req.body || {};

  const systemPrompt = `你是「阿晟成交型房仲短影音腳本助理」。
請使用繁體中文，語氣要像台灣房仲短影音創作者，專業但不要太制式。
任務：根據使用者選擇的地區、情緒共鳴、鉤子方向、影片風格、影片目標與案件背景，生成能直接拍攝的短影音內容。
規則：
1. 不要誇大保證獲利、不要說一定增值、不要製造不實資訊。
2. 要有開場3秒鉤子、主體口播、鏡頭建議、字幕建議、CTA。
3. 如果輸出類型是「只要鉤子」，只產生多組鉤子。
4. 如果輸出類型是「只要腳本」，只產生完整口播稿。
5. 如果輸出類型是「只要貼文」，產生 Threads / Facebook 貼文。
6. 如果輸出類型是「時事口播推薦」，請產生「房仲可用的日更話題方向」。注意：你不一定能取得即時新聞，所以要避免捏造具體新聞事件；可以用近期常見社會議題、房市心理、利率、租金、通膨、科技園區、交通建設、青年買房焦慮等方向包裝成可拍題材。
7. 內容要具體、可拍、可直接複製使用。`;

  const userPrompt = `請根據以下設定生成內容：

事件類型：${form.eventType || ''}
人性共鳴核心：${form.personality || ''}
鉤子方向：${form.hook || ''}
影片風格：${form.videoStyle || ''}
影片目標：${form.goal || ''}
地區：${form.area || ''}
主角身分：${form.role || ''}
輸出類型：${form.output || ''}
案件背景：${form.caseInfo || ''}

請輸出清楚標題與段落，不要用 Markdown 表格。`;

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        input: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_output_tokens: 1600
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || 'OpenAI API 呼叫失敗。';
      return res.status(response.status).json({ error: message });
    }

    const script = data.output_text ||
      data.output?.flatMap((item) => item.content || [])
        ?.map((content) => content.text || '')
        ?.join('\n')
        ?.trim();

    return res.status(200).json({ script: script || 'AI 沒有回傳文字，請再試一次。' });
  } catch (error) {
    return res.status(500).json({ error: error.message || '伺服器發生錯誤。' });
  }
}
