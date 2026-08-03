import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');

    const prompt = `Analyze this invoice image and extract the following details in strict JSON format without any markdown formatting like \`\`\`json:
    {
      "vendorName": "string",
      "vendorGstin": "string",
      "invoiceNumber": "string",
      "invoiceDate": "string",
      "grandTotal": number,
      "items": [
        {
          "description": "string",
          "quantity": number,
          "rate": number,
          "amount": number
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
        prompt,
      ],
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error('No response from AI model');
    }

    const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const extractedData = JSON.parse(cleanJson);

    return NextResponse.json(extractedData);
  } catch (error: any) {
    console.error('Invoice extraction error:', error);
    return NextResponse.json({ error: error.message || 'Failed to extract invoice' }, { status: 500 });
  }
}
