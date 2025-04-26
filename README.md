# 🛒 PeerStore — 去中心化 P2P 商店平台 | Decentralized P2P Store Platform

**PeerStore** 是一套基於 WebRTC 構建的去中心化商店平台，
讓任何人都可以在網頁上建立自己的商店，並以 P2P 技術直接將商品資料與圖片傳送給訪客，
全程**無需中心伺服器儲存或中繼**。

**PeerStore** is a decentralized store platform built on WebRTC,
allowing anyone to create their own store online and directly transmit product data and images to visitors through P2P technology — 
**without any central server storage or relay**.

🚀 支援商品上架、圖片同步、下單範例，且未來將支援 Electron 桌面版常駐節點。
🚀 Supports product listing, image synchronization, ordering flow, and will soon support Electron desktop nodes.

> 🔗 線上試用網址 Demo Website: [https://d3n0cfu9jr88fu.cloudfront.net/](https://d3n0cfu9jr88fu.cloudfront.net/)

---

## 🎥 Demo Video

[![Watch the demo](https://img.youtube.com/vi/a1aFY9nIiGc/0.jpg)](https://youtu.be/a1aFY9nIiGc)

### 📄 影片說明 | Demo Description

這段影片展示了 PeerStore 平台的完整操作流程，包括：
- 如何從 Browse 頁面探索商店
- 點擊商店後即時建立 P2P 連線
- 瀏覽商品、查看圖片（即時從商家端傳輸）
- 選擇商品並提交下單

全程不經中心化伺服器，採用 WebRTC 資料通道點對點傳輸。  
🚀 體驗去中心化、自主管理、快速分享的下一代線上商店系統！

---

This video demonstrates the full flow of PeerStore:
- Browsing available stores via the Browse page
- Establishing a real-time P2P WebRTC connection to the selected store
- Browsing product lists and viewing images (transmitted directly from the store owner)
- Selecting products and submitting an order

Entirely serverless — product data and images are transferred peer-to-peer using WebRTC Data Channels.  
🚀 Experience the next generation of decentralized, self-hosted, instantly shareable online stores!

---

## ✨ 特色 Features

- **去中心化資料流 Decentralized Data Flow** — 商品資料與圖片由商店端即時傳送，不經任何平台。
- **WebRTC P2P 傳輸 P2P Transfer** — 使用 coturn + API Gateway signaling 建立點對點連線。
- **簡單快速開店 Easy Store Setup** — 輸入基本資料即可建立商店，生成分享連結。
- **支援下單流程 Ordering Supported** — 訪客可選購商品並提交訂單回店家。
- **無中心資料庫 No Central Database** — 商品資料快取於本地 IndexedDB。
- **AWS Amplify 架構 AWS Amplify Backend** — 登入、帳戶管理與訂單記錄。
- **未來目標 Upcoming** — Electron 桌面版支援，提供背景持續運作能力。

---

## 🎬 Demo 流程 Demo Walkthrough

1. **建立商店 Create a Store**  
   填寫商店名稱、簡介，新增商品與圖片。

2. **生成分享連結 Share Your Store**  
   取得專屬 URL，分享給朋友或社群。

3. **訪客連線 Visitor Connects**  
   訪客自動透過 WebRTC 建立連線並接收資料。

4. **選購下單 Purchase and Order**  
   選擇商品，提交訂單。

---

## 🏗️ 技術架構 Tech Stack

| 層級 Layer | 技術 Technology |
|------------|-----------------|
| 前端 Frontend | Vue 3 + Composition API + Vite |
| 後端認證 Backend (Auth) | AWS Amplify + AppSync + Cognito |
| 資料傳輸 Data Transfer | WebRTC (DataChannel) + coturn + API Gateway |
| 本地儲存 Local Storage | IndexedDB (for products and images) |
| 其他 Others | S3 hosting + CloudFront CDN |

---

## 🛠 本地開發 Local Development

```bash
# 安裝依賴 Install dependencies
npm install

# 啟動本地伺服器 Start local dev server
npm run dev
```

---

## 📄 授權 License

本專案採用 [MIT License](LICENSE)。
This project is licensed under the [MIT License](LICENSE).

---

> PeerStore 希望讓每個人都能掌控自己的線上商店，自由分享，不受平台綁定。
> PeerStore empowers everyone to own and share their online store — free from centralized platforms.
