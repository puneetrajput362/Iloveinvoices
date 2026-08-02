import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/chatCompletion';

const INVOICE_EXTRACTION_PROMPT = `You are an expert Indian GST invoice data extraction AI. 
Analyze the provided invoice image or PDF and extract ALL of the following fields.
Return ONLY a valid JSON object with no markdown, no explanation, no code fences.

Required JSON structure:
{
  "vendorName": "string — Vendor/Shop/Company name",
  "gstin": "string — 15-character GSTIN of vendor (e.g. 27AAPCS1234K1ZR), empty string if not found",
  "invoiceNo": "string — Invoice number",
  "invoiceDate": "string — Invoice date in DD/MM/YYYY format",
  "buyerGstin": "string — Buyer GSTIN if present, empty string if not found",
  "placeOfSupply": "string — Place/State of supply if mentioned",
  "items": [
    {
      "name": "string — Item/product description",
      "qty": "string — Quantity as number string",
      "rate": "string — Unit rate/price as number string (before tax)",
      "taxRate": "string — GST tax rate percentage as number string (e.g. '18')"
    }
  ],
  "cgst": "string — Total CGST amount as number string",
  "sgst": "string — Total SGST amount as number string",
  "igst": "string — Total IGST amount as number string",
  "subtotal": "string — Subtotal before tax as number string",
  "grandTotal": "string — Final grand total including all taxes as number string",
  "notes": "string — Any additional notes, PO numbers, or remarks"
}

Rules:
- All numeric fields must be plain number strings (e.g. "1200.50"), no currency symbols or commas
- If a field is not found in the invoice, use empty string "" for strings and [] for arrays
- For items array, include every line item found
- Tax rate for each item should be the combined GST rate (e.g. if CGST 9% + SGST 9%, taxRate = "18")
- Dates must be in DD/MM/YYYY format
- GSTIN must be exactly 15 characters if present`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, mimeType } = body;

    if (!fileData) {
      return NextResponse.json({ error: 'No file data provided' }, { status: 400 });
    }

    const dataUri = fileData.startsWith('data:') ? fileData : `data:${mimeType};base64,${fileData}`;

    const isImage = mimeType?.startsWith('image/');
    const isPdf = mimeType === 'application/pdf';

    if (!isImage && !isPdf) {
      return NextResponse.json({ error: 'Unsupported file type. Use JPG, PNG, or PDF.' }, { status: 400 });
    }

    const messageContent: any[] = [
      { type: 'text', text: INVOICE_EXTRACTION_PROMPT },
    ];

    if (isImage) {
      messageContent.push({
        type: 'image_url',
        image_url: { url: dataUri },
      });
    } else {
      messageContent.push({
        type: 'file',
        file: { file_data: dataUri },
      });
    }

    const response = await getChatCompletion(
      'GEMINI',
      'gemini/gemini-2.5-flash',
      [{ role: 'user', content: messageContent }],
      { temperature: 0.1, max_tokens: 2048 }
    );

    const rawContent = response?.choices?.[0]?.message?.content ?? '';

    // Strip markdown code fences if present
    const cleaned = rawContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    let extracted: Record<string, unknown>;
    try {
      extracted = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON', raw: rawContent },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: extracted });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
