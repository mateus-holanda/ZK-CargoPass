import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { DEFAULT_ANALYSIS, DocumentAnalysis } from '@/types/document';
import { api } from '@/lib/axios';
import { z } from 'zod';

// Simple in-memory rate limiter
class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }>;
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 60000, maxRequests: number = 10) {
    this.requests = new Map();
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  isRateLimited(ip: string): { limited: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const requestData = this.requests.get(ip);

    if (!requestData || now > requestData.resetTime) {
      this.requests.set(ip, { count: 1, resetTime: now + this.windowMs });
      return { limited: false, remaining: this.maxRequests - 1, resetTime: now + this.windowMs };
    }

    if (requestData.count >= this.maxRequests) {
      return { limited: true, remaining: 0, resetTime: requestData.resetTime };
    }

    requestData.count++;
    this.requests.set(ip, requestData);
    return { limited: false, remaining: this.maxRequests - requestData.count, resetTime: requestData.resetTime };
  }
}

// Initialize rate limiter
const rateLimiter = new RateLimiter(60000, 10); // 10 requests per minute

// Input validation schema
const documentAnalysisSchema = z.object({
  data: z.string().min(1).max(100000), // Limit text size to prevent token abuse
});

// Token usage tracking
const MAX_TOKENS_PER_REQUEST = 4000; // Adjust based on your needs
const MAX_REQUESTS_PER_DAY = 100;

async function analyzeWithAI(text: string): Promise<DocumentAnalysis> {
  try {
    // Validate input length
    if (text.length > 100000) {
      throw new Error('Input text is too long');
    }

    const openai = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4-turbo-preview", // Using the latest model
      maxTokens: MAX_TOKENS_PER_REQUEST,
      temperature: 0.1, // Lower temperature for more consistent results
    });

    const promptTemplate = new PromptTemplate({
      template: `Analyze the following customs declaration document text and extract relevant information. 
      If any information is not found, use "N/A" for text fields and 0 for numeric fields.
      The document may be in Portuguese or English.
      
      Document text:
      {text}
      
      Extract the information in the following JSON format:
      {
        "di_number": string,
        "registration_date": string (YYYY-MM-DD),
        "customs_clearance_date": string (YYYY-MM-DD),
        "importer": {
          "cnpj": string,
          "company_name": string,
          "address": string
        },
        "shipper": {
          "name": string,
          "country": string
        },
        "cargo": {
          "description": string,
          "gross_weight_kg": number,
          "net_weight_kg": number,
          "volume_m3": number,
          "packages": number,
          "packaging_type": string
        },
        "transport": {
          "modality": string,
          "vessel_name": string,
          "bill_of_lading": string,
          "container_numbers": string[],
          "port_of_loading": string,
          "port_of_discharge": string
        },
        "financial": {
          "total_declared_value": number,
          "tax_percentage": number,
          "amount_paid": number,
          "incoterm": string,
          "exchange_rate": number,
          "taxes": {
            "ii": number,
            "ipi": number,
            "pis": number,
            "cofins": number,
            "icms": number
          }
        },
        "ncm_codes": [
          {
            "ncm": string,
            "description": string,
            "quantity": number,
            "unit": string,
            "unit_value_usd": number
          }
        ],
        "documents": [
          {
            "type": string,
            "number": string,
            "date": string,
            "issuer": string
          }
        ],
        "status": string,
        "observations": string
      }`,
      inputVariables: ["text"],
    });

    const response = await openai.invoke([
      { role: "user", content: await promptTemplate.format({ text }) }
    ]);
    
    const content = response?.content as string;
    if (!content) return DEFAULT_ANALYSIS;

    // Validate JSON response
    try {
      const parsedContent = JSON.parse(content.replace(/^```json\n/, '').replace(/\n```$/, ''));
      return parsedContent;
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return DEFAULT_ANALYSIS;
    }
  } catch (error) {
    console.error('AI analysis error:', error);
    return DEFAULT_ANALYSIS;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { limited, remaining, resetTime } = rateLimiter.isRateLimited(ip);
    
    if (limited) {
      return NextResponse.json(
        { 
          error: 'Too many requests',
          remaining,
          resetTime: new Date(resetTime).toISOString()
        },
        { status: 429 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = documentAnalysisSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const file = validationResult.data;
    const analysis = await analyzeWithAI(file.data);

    body.data = { id: new Date().getTime().toString(), verifier: "zk-cargo-pass" };
    
    await api.post(`${process.env.NEXT_PUBLIC_API_URL}/document`, 
      { ...body },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('Cookie') || '',
        },
        withCredentials: true,
      }
    );

    return NextResponse.json({ ...file, data: analysis });
  } catch (error) {
    console.error('Document analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 