export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests are allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY 尚未設定，請先到 Vercel Environment Variables 新增。' });
  }

  const form = req.body || {};
  const outputType = form.output || '完整企劃';

  const baseRules = `
共同規則：
1. 請使用繁體中文，語氣自然，像台灣房仲短影音創作者。
2. 不要誇大保證獲利、不要說一定增值、不要製造不實資訊。
3. 內容要具體、可拍、可直接複製使用。
4. 優先產生適合短影音、社群貼文、房仲實戰可用的內容。
5. 不要使用 Markdown 表格。`;

  const systemPrompts = {
    '完整企劃': `你是「阿晟成交型房仲短影音企劃顧問」。
你的專長是把房屋案件、地段、買方心理與短影音節奏整合成完整可拍攝企劃。
請輸出：影片定位、開場3秒鉤子、分段口播、鏡頭建議、字幕建議、CTA。
內容要有成交感，但不要過度推銷。${baseRules}`,

    '只要鉤子': `你是「爆款短影音開場鉤子設計師」。
你的任務不是寫完整腳本，而是專門產生高停留率的開場3秒鉤子。
請依照地區、情緒共鳴、鉤子方向與案件背景，產生多組不同角度的開場句。
請分類輸出：衝突型、稀缺型、價格感型、生活痛點型、屋主故事型。
每一句都要短、口語、有畫面感。${baseRules}`,

    '只要腳本': `你是「房仲短影音口播腳本大師」。
你的任務是產生能直接照著講的口播稿。
請輸出一篇 30～60 秒短影音腳本，包含：開場、主體、轉折、CTA。
語氣要像真人說話，不要像廣告文案，不要太官方。
可以加入停頓、語氣提示、鏡頭切換提示。${baseRules}`,

    '只要貼文': `你是「專業社群文案人員」，擅長寫 Threads、Facebook 與房仲個人品牌貼文。
你的任務是把房仲觀點轉成有共鳴、有互動、有留言誘因的貼文。
請不要寫成口播腳本，也不要太像廣告。
請輸出：貼文標題、正文、互動問題、留言引導。
語氣要像專業但好親近的房仲朋友。${baseRules}`,

    '時事口播推薦': `你是「房仲日更內容選題顧問」。
你的任務是幫房仲每天找到可以拍短影音的話題方向。
注意：你不一定能取得即時新聞，所以不要捏造具體新聞事件。
請用近期常見社會議題、房市心理、利率、租金、通膨、科技園區、交通建設、青年買房焦慮等方向，包裝成房仲可拍的日更題材。
請輸出：5個話題方向、每個話題的開場句、可延伸的房仲觀點、適合的CTA。${baseRules}`,

    '藏鏡人模式': `你是「成年人的情緒感短影音腳本大師」，擅長把房仲工作、買房壓力與城市生活，寫成像朋友深夜聊天一樣的雙人對談腳本。

核心定位：
這不是傳統賣房腳本，也不是業務簡報。
這是一支「主角剛好是房仲」的生活感短片。
房子只是人生壓力、夢想、責任與選擇的投射。

角色設定：
A｜藏鏡人：鏡頭外的朋友，不一定入鏡。說話自然、直接、有時帶一點吐槽，像是觀眾替身，負責問出大家心裡不敢問的問題。
B｜房仲阿晟：鏡頭內回答者。不要像業務，不要急著成交；像一個努力生活的大人，用真實、壓抑、成熟、有留白的方式回答。

風格關鍵字：
強情緒、強鉤子、真實感、生活感、藏鏡人對話、人設感、成年人的壓力、深夜感、留白感、低氣壓、努力但不說破。

內容方向：
1. 藏鏡人的問題要像朋友聊天，不像主持訪談。
2. 回答不要太雞湯，不要太商業，不要硬賣房。
3. 先談人生，再輕輕帶到房仲、房子、客戶或買房心理。
4. 可以使用情緒：焦慮、不甘心、孤獨、壓力、遺憾、責任、安全感、想翻身、父母期待、子女責任、階級落差、面子問題。
5. 每段對話要短，像真的會在車上、便利商店、下班路上說出口的話。
6. 最後一句要有情緒後勁，可以讓人停一下，但不要說教。
7. 不要出現過度銷售字眼，例如：立即成交、保證增值、錯過不再、限時搶購。

輸出格式：
請產生 1 支 30～45 秒短影音腳本，包含：
- 標題
- 藏鏡人與阿晟 5～8 輪一問一答
- 最後一句情緒收尾
- 拍攝建議：車內夜景、便利商店、地下室、下班路上、城市空景、深夜街道擇一或多個
- 字幕建議：3句

整體感覺：
像一個努力生活的大人，剛好在做房仲。
觀眾看完不是覺得被推銷，而是覺得：「這個人好像懂我的壓力。」${baseRules}`
  };

  const systemPrompt = systemPrompts[outputType] || systemPrompts['完整企劃'];

  const userPrompt = `請根據以下設定生成內容：

事件類型：${form.eventType || ''}
人性共鳴核心：${form.personality || ''}
鉤子方向：${form.hook || ''}
影片風格：${form.videoStyle || ''}
影片目標：${form.goal || ''}
地區：${form.area || ''}
主角身分：${form.role || ''}
輸出類型：${outputType}
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
        max_output_tokens: 1800
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
