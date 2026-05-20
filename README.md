# 房仲腳本生成器 GPT 串接版

這是一個 React + Vite + Vercel Serverless API 的單頁網站。

## 功能
- 下拉式選單控制生成條件
- 串接 OpenAI API 生成房仲短影音腳本
- API Key 放在 Vercel Environment Variables，不會出現在前端

## Vercel 環境變數
請在 Vercel 專案設定新增：

```txt
OPENAI_API_KEY=你的 OpenAI API Key
```

建議套用到 Production / Preview / Development。

## 部署
把整個資料夾覆蓋到 GitHub repository，Commit / Push 後，Vercel 會自動重新部署。
