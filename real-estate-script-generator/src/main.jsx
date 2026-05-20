import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';
import { Copy, RotateCcw, Sparkles, Trash2, Wand2 } from 'lucide-react';
import './style.css';

const options = {
  eventType: ['地段開局', '屋主急售', '稀有景觀', '首購撿便宜', '換屋剛需', '廠房倉儲', '學區宅', '投資收租'],
  personality: ['誠懇', '專業', '有衝突感', '接地氣', '成交型', '朋友聊天感'],
  hook: ['衝突', '反差', '稀缺', '價格感', '真人實境', '屋主故事', '買方痛點'],
  videoStyle: ['真人實境', '口播快節奏', '看屋導覽', '撿便宜系列', '成交行版本', 'Threads延伸文'],
  goal: ['提升留言', '引導私訊', '建立信任', '創造稀缺', '吸引屋主委託'],
  area: ['高雄', '左營高鐵', '榮總生活圈', '楠梓', '仁武', '橋頭', '台南', '自訂區域'],
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
    area: '左營高鐵',
    role: '屋主',
    caseInfo: '屋主因為換屋急售，鄰近高鐵、榮總生活圈，總價比同社區行情更有機會。',
    output: '完整企劃'
  };
  const [form, setForm] = useState(defaultForm);
  const [copied, setCopied] = useState(false);
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const script = useMemo(() => {
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

    return `【完整企劃】\n\n影片定位：${form.videoStyle} × ${form.personality} × ${form.goal}\n\n0-3秒｜鉤子\n${hookLine}\n\n4-15秒｜情境\n${form.caseInfo}\n\n16-35秒｜成交觀點\n這間不要只看表面條件，真正的重點是它卡在${form.area}，又剛好有${form.eventType}的題材。對${form.role}來說，這種案子最適合先比較行情，再決定要不要出手。\n\n36-50秒｜信任補強\n我會建議你不要衝動下斡旋，但也不要等到別人出價才開始後悔。先看成交行情，再看屋主目前的價格彈性。\n\n51-60秒｜CTA\n${cta}\n\n字幕建議：\n「這間不一定最漂亮，但很有成交機會」\n「${form.area} × 價格感 × 屋主動機」\n「想看行情，留言我整理給你」`;
  }, [form]);

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
            <p>本地模擬版</p>
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
                {['完整企劃', '只要鉤子', '只要腳本', '只要貼文'].map((item) => (
                  <PillButton key={item} active={form.output === item} onClick={() => set('output', item)}>{item}</PillButton>
                ))}
              </div>
            </div>
            <div className="actions">
              <button className="primary"><Sparkles size={18} /> 生成爆紅腳本</button>
              <button className="secondary" onClick={() => setForm(defaultForm)}><RotateCcw size={18} /> 重生</button>
              <button className="secondary" onClick={() => set('caseInfo', '')}><Trash2 size={18} /> 清空</button>
            </div>
          </section>

          <section className="card resultCard">
            <div className="resultHeader">
              <div><p className="eyebrow small">OUTPUT</p><h2>生成結果</h2></div>
              <button className="copy" onClick={copyScript}><Copy size={16} /> {copied ? '已複製' : '複製'}</button>
            </div>
            <pre>{script}</pre>
          </section>
        </main>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
