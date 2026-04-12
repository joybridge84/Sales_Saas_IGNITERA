'use server'

import { PrismaClient } from '@prisma/client';
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateAISuggestion(leadId: string) {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      activities: { orderBy: { happenedAt: 'desc' }, take: 5 },
      proofAssets: { take: 3 }
    }
  });

  if (!lead) throw new Error('Lead not found');

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. Falling back to simulation logic.");
      return simulateResponse(lead);
  }

  // Build the prompt context
  const context = `
    顧客情報:
    - 会社名: ${lead.companyName}
    - 業界: ${lead.industry || '不明'}
    - リードソース: ${lead.source}
    - 課題仮説: ${lead.painHypothesis || '未設定'}
    
    直近の活動内容:
    ${lead.activities.map((a: any) => `- ${a.activityType}: ${a.subject} (${a.detail})`).join('\n')}
    
    保有している実績/資産(Proof Assets):
    ${lead.proofAssets.map((a: any) => `- ${a.title}: ${a.impactMetric} (${a.summary})`).join('\n')}
  `;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `あなたは「IGNITERA」というEC改善・DX支援サービスのトップ営業です。
上記の顧客背景に基づき、次に送るべき「サンクスメール」または「再アプローチメール」のドラフトを作成してください。
文体は「丁寧かつ論理的、しかし熱意が伝わる」スタイルで。
特に、蓄積された「保有資産(Proof Assets)」の具体的数値を引用して、相手に「話を聞く価値がある」と思わせる内容にしてください。
出力はメール本文のみ、日本語でお願いします。

---
${context}
---`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return {
        suggestion: response.text(),
        model: "gemini-1.5-flash",
        timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return simulateResponse(lead);
  }
}

function simulateResponse(lead: any) {
    // Fallback logic if API fails or key is missing
    const industry = lead.industry || '一般企業';
    return {
        suggestion: `【シミュレーション】\n株式会社${lead.companyName}様\n\n先日はお時間をいただきありがとうございました。\n貴社の${industry}における課題に対し、弊社の実績でも高い成果が出ているアプローチが有効です。\nぜひ詳細な提案の機会をいただけますと幸いです。\n\n※GEMINI_API_KEYを設定すると、より高度な生成が可能です。`,
        model: "IGNITERA-Mock-v1",
        timestamp: new Date().toISOString()
    };
}
