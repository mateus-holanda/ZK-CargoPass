import { NextRequest, NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import pdfParse from 'pdf-parse';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

interface DocumentAnalysis {
  di_number: string;
  registration_date: string;
  customs_clearance_date: string;
  financial: {
    total_declared_value_usd: number;
    incoterm: string;
    exchange_rate: number;
    taxes: {
      ii: number;
      ipi: number;
      pis: number;
      cofins: number;
      icms: number;
    };
  };
}

async function extractDataFromPDF(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF document');
  }
}

async function analyzeWithExternalAPI(text: string): Promise<DocumentAnalysis> {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/document/analyze`, {
      document_text: text,
      document_type: 'DI',
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Id': localStorage.getItem('zk-cargo-pass-user-id') || '',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error calling external API:', error);
    throw new Error('Failed to analyze document with external service');
  }
}

export async function POST(request: NextRequest) {
  let tempFilePath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 3MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Create a unique filename and save the file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${uuidv4()}.pdf`;
    const uploadDir = join(process.cwd(), 'tmp');
    tempFilePath = join(uploadDir, filename);
    await writeFile(tempFilePath, buffer);

    // Extract text from PDF
    const extractedText = await extractDataFromPDF(buffer);

    // Analyze with external API
    const analysis = await analyzeWithExternalAPI(extractedText);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error processing document:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error processing document' },
      { status: 500 }
    );
  } finally {
    // Clean up temporary file
    if (tempFilePath) {
      try {
        await unlink(tempFilePath);
      } catch (error) {
        console.error('Error deleting temporary file:', error);
      }
    }
  }
} 