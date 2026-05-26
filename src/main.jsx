import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Sparkles, Trash2, Wand2 } from 'lucide-react';
import './style.css';

const options = {
  eventType: ['地段開局', '屋主急售', '稀有景觀', '首購撿便宜', '換屋剛需', '廠房倉儲', '學區宅', '投資收租'],
  personality: ['誠懇', '專業', '有衝突感', '接地氣', '成交型', '朋友聊天感', '焦慮', '不甘心', '家庭責任', '被看不起', '想翻身', '害怕失敗', '孤獨', '羨慕', '壓力', '遺憾', '父母期待', '子女責任', '階級落差', '面子問題', '安全感'],
  hook: ['衝突', '反差', '稀缺', '價格感', '真人實境', '屋主故事', '買方痛點'],
  videoStyle: ['真人實境', '口播快節奏', '看屋導覽', '撿便宜系列', '成交行版本', 'Threads延伸文'],
  goal: ['提升留言', '引導私訊', '建立信任', '創造稀缺', '吸引屋主委託'],
  area: ['高雄市全區', '新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '三民區', '楠梓區', '小港區', '左營區', '仁武區', '大社區', '岡山區', '路竹區', '阿蓮區', '田寮區', '燕巢區', '橋頭區', '梓官區', '彌陀區', '永安區', '湖內區', '鳳山區', '大寮區', '林園區', '鳥松區', '大樹區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區', '茂林區', '其他縣市'],
  role: ['屋主', '買方', '首購族', '換屋族', '投資客', '企業主']
};

function SelectField({ label, value, onChange, items }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {items.map((item) => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function PillButton({ active, children, onClick }) {
  return (
    <button onClick={onClick} className={active ? 'pill active' : 'pill'}>
      {children}
    </button>
  );
}

function App() {
  const defaultForm = {
    eventType: '地段開局',
    personality: '誠懇',
    hook: '衝突',
    videoStyle: '真人實境',
    goal: '提升留言',
    area: '左營區',
    role: '屋主',
    caseInfo: '屋主因為換屋急售，鄰近高鐵、榮總生活圈，總價比同社區行情更有機會。',
    output: '完整企劃'
  };
  const [form, setForm] = useState(defaultForm);
  const [copied, setCopied] = useState(false);
  const [aiScript, setAiScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (key, value) => {
    setAiScript('');
    setError('');
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fallbackScript = useMemo(() => {
    const hookLine = {
      衝突: `你以為${form.area}旁邊的房子都很貴嗎？這間可能會顛覆你的想法。`,
      反差: '外觀看起來很低調，但條件打開後，我覺得這間真的有戲。',
      稀缺: `這種條件不是每天都有，尤其在${form.area}這個位置。`,
      價格感: '同樣預算，你可能買不到這種地段跟生活機能。',
      真人實境: '我現在人就在現場，這間我想用最直接的方式跟你說。',
      屋主故事: '屋主不是不想賣好價格，而是現在有一個很明確的換屋時間壓力。',
      買方痛點: '如果你一直覺得好地段買不起，這間你真的可以先看一下。'
    }[form.hook];

    const body = `這間主打的是「${form.eventType}」，適合${form.role}先放入口袋名單。\n\n物件重點：${form.caseInfo}\n\n我的看法是，這支影片不要一開始就講格局，而是先講買方最在意的問題：位置、價格、稀缺性。用${form.personality}的語氣，把觀眾帶進情境，再用一個明確行動收尾。`;

    const cta = {
      提升留言: '想看我整理成交行情，留言「行情」我傳給你。',
      引導私訊: '想知道這間底價空間，私訊我「想看」。',
      建立信任: '我不保證它最便宜，但我會幫你判斷值不值得出手。',
      創造稀缺: '這種條件通常不會等太久，有興趣建議先約看。',
      吸引屋主委託: '如果你也想讓房子被精準看見，我可以幫你規劃一套銷售內容。'
    }[form.goal];

    if (form.output === '只要鉤子') return `【開場鉤子】\n${hookLine}\n\n備用鉤子：\n1. 這間不是最漂亮，但它有一個很關鍵的優勢。\n2. 如果你正在找${form.area}，這間我會建議先看。\n3. 好房子不是只有裝潢，價格跟位置才是成交關鍵。`;
    if (form.output === '只要腳本') return `【30秒口播腳本】\n${hookLine}\n\n${body}\n\n${cta}`;
    if (form.output === '只要貼文') return `【Threads / FB貼文】\n${hookLine}\n\n${form.caseInfo}\n\n我會建議買方先看三件事：地段是否保值、價格是否有空間、未來轉手是否好賣。\n\n${cta}`;

    if (form.output === '時事口播推薦') return `【日更用時事口播短片】

定位：用最近兩三天的熱門新聞，轉成房仲可以拍的短口播主題。

注意：目前這一版尚未串接新聞 API，所以以下是「固定示範版」。等串接 GPT / 即時新聞後，會自動依照最新時事更新。

主題1｜房價焦慮型
開場：最近很多人看到房價新聞，第一個反應都是：現在到底還能不能買？
切入：其實買不買不是重點，重點是你買的區域有沒有未來性。像${form.area}，我會先看交通、工作機會、生活圈跟轉手性。
CTA：想知道你的預算適合哪一區，留言「區域」我幫你整理。

主題2｜租金壓力型
開場：如果你現在每個月租金越繳越有壓力，這支影片你可以聽一下。
切入：不是每個人都一定要買房，但當租金跟房貸差距越來越小，有些人就會開始重新計算。
CTA：想看租屋和買房怎麼比較，留言「試算」。

主題3｜家庭責任型
開場：很多人買房不是為了炫耀，而是想讓家人有一個穩定的地方。
切入：如果你選的是${form.area}，我會建議先看生活機能、醫療、學區跟長輩方便性，不要只看裝潢漂亮。
CTA：想看適合家庭的物件條件，私訊我「家庭」。

推薦拍法：
1. 前3秒先講新聞或社會情緒，不要先講房子。
2. 中段把時事轉成買方痛點。
3. 結尾用留言關鍵字收互動。`;

    if (form.output === '藏鏡人模式') return `【藏鏡人模式｜雙人對談腳本】

定位：用一問一答的生活化對話，把房市觀點自然講出來，不要太像廣告。

角色設定：
A｜藏鏡人：像朋友一樣提問，負責問出觀眾心裡的疑問。
B｜阿晟：用簡單白話回答，避免太商業、避免硬推銷。

0-3秒｜開場
A：欸，我問你喔，現在大家都說房子很貴，那${form.area}還能看嗎？
B：可以看，但不要亂看。重點不是貴不貴，是你看的條件有沒有真的符合需求。

4-20秒｜生活化問題
A：可是我身邊很多人都怕買了就套住耶。
B：這個很正常，所以我會先看三件事：生活圈、轉手性、還有屋主是不是真的有談的空間。

21-40秒｜帶入案件
A：那這間你覺得重點是什麼？
B：這間比較值得注意的是「${form.eventType}」，再加上背景是：${form.caseInfo}
所以它不是單純漂亮不漂亮，而是條件跟價格有沒有機會對上。

41-55秒｜降低商業感
A：所以你不是叫大家馬上買？
B：不是，我反而建議先比較行情。看懂行情以後，你才知道這間是貴、合理，還是真的有機會。

56-60秒｜自然 CTA
A：那想看怎麼辦？
B：留言「想看」，我把基本條件跟行情整理給你。

拍攝建議：
1. 藏鏡人不用入鏡，可以在鏡頭外提問。
2. 阿晟看鏡頭回答，像聊天，不要像背稿。
3. 字幕可以強調：不是叫你衝，是先看懂行情。`;

    return `【完整企劃】\n\n影片定位：${form.videoStyle} × ${form.personality} × ${form.goal}\n\n0-3秒｜鉤子\n${hookLine}\n\n4-15秒｜情境\n${form.caseInfo}\n\n16-35秒｜成交觀點\n這間不要只看表面條件，真正的重點是它卡在${form.area}，又剛好有${form.eventType}的題材。對${form.role}來說，這種案子最適合先比較行情，再決定要不要出手。\n\n36-50秒｜信任補強\n我會建議你不要衝動下斡旋，但也不要等到別人出價才開始後悔。先看成交行情，再看屋主目前的價格彈性。\n\n51-60秒｜CTA\n${cta}\n\n字幕建議：\n「這間不一定最漂亮，但很有成交機會」\n「${form.area} × 價格感 × 屋主動機」\n「想看行情，留言我整理給你」`;
  }, [form]);

  const script = aiScript || fallbackScript;

  const generateAiScript = async () => {
    setIsLoading(true);
    setError('');
    setAiScript('');
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || '生成失敗，請稍後再試。');
      }
      setAiScript(data.script || 'AI 沒有回傳內容，請再試一次。');
    } catch (err) {
      setError(err.message || '生成失敗，請稍後再試。');
    } finally {
      setIsLoading(false);
    }
  };

  const copyScript = async () => {
    await navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="page">
      <div className="container">
        <motion.header initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="hero">
          <div>
            <p className="eyebrow">AI SCRIPT LAB</p>
            <h1>房仲腳本生成器</h1>
            <p className="subtitle">輸入設定，一鍵生成短影音企劃、鉤子、腳本與社群文案。</p>
          </div>
          <div className="brandBox">
            <p>GPT 串接版</p>
            <strong>阿晟成交風格</strong>
          </div>
        </motion.header>

        <main className="grid">
          <section className="card">
            <div className="sectionTitle"><Wand2 size={20} /><h2>輸入設定</h2></div>
            <div className="formGrid">
              <SelectField label="事件類型" value={form.eventType} onChange={(v) => set('eventType', v)} items={options.eventType} />
              <SelectField label="人性共鳴核心" value={form.personality} onChange={(v) => set('personality', v)} items={options.personality} />
              <SelectField label="鉤子方向" value={form.hook} onChange={(v) => set('hook', v)} items={options.hook} />
              <SelectField label="影片風格" value={form.videoStyle} onChange={(v) => set('videoStyle', v)} items={options.videoStyle} />
              <SelectField label="影片目標" value={form.goal} onChange={(v) => set('goal', v)} items={options.goal} />
              <SelectField label="地區" value={form.area} onChange={(v) => set('area', v)} items={options.area} />
              <SelectField label="主角身分" value={form.role} onChange={(v) => set('role', v)} items={options.role} />
            </div>
            <label className="field full">
              <span>案件背景</span>
              <textarea value={form.caseInfo} onChange={(e) => set('caseInfo', e.target.value)} rows="4" />
            </label>
            <div className="outputType">
              <p>輸出類型</p>
              <div className="pillGrid">
                {['完整企劃', '只要鉤子', '只要腳本', '只要貼文', '時事口播推薦', '藏鏡人模式'].map((item) => (
                  <PillButton key={item} active={form.output === item} onClick={() => set('output', item)}>{item}</PillButton>
                ))}
              </div>
            </div>
            <div className="actions">
              <button className="primary" onClick={generateAiScript} disabled={isLoading}>
                <Sparkles size={18} /> {isLoading ? 'AI 生成中...' : '生成爆紅腳本'}
              </button>
              <button className="secondary" onClick={() => setForm(defaultForm)}><RotateCcw size={18} /> 重生</button>
              <button className="secondary" onClick={() => set('caseInfo', '')}><Trash2 size={18} /> 清空</button>
            </div>
          </section>

          <section className="card resultCard">
            <div className="resultHeader">
              <div><p className="eyebrow small">OUTPUT</p><h2>生成結果</h2></div>
              <button className="copy" onClick={copyScript}><Copy size={16} /> {copied ? '已複製' : '複製'}</button>
            </div>
            {error && <div className="errorBox">{error}</div>}
            <pre>{isLoading ? 'AI 正在依照你的設定生成腳本，請稍候...' : script}</pre>
          </section>
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
