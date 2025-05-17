import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import axios from 'axios';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

interface DocumentAnalysis {
  di_number: string;
  registration_date: string;
  customs_clearance_date: string;
  importer: {
    cnpj: string;
    company_name: string;
    address: string;
  };
  shipper: {
    name: string;
    country: string;
  };
  cargo: {
    description: string;
    gross_weight_kg: number;
    net_weight_kg: number;
    volume_m3: number;
    packages: number;
    packaging_type: string;
  };
  transport: {
    modality: string;
    vessel_name: string;
    bill_of_lading: string;
    container_numbers: string[];
    port_of_loading: string;
    port_of_discharge: string;
  };
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
  ncm_codes: {
    ncm: string;
    description: string;
    quantity: number;
    unit: string;
    unit_value_usd: number;
  }[];
  documents: {
    type: string;
    number: string;
    date: string;
    issuer?: string;
  }[];
  status: string;
  observations?: string;
  raw_text?: string;
}

const DEFAULT_ANALYSIS: DocumentAnalysis = {
  di_number: "N/A",
  registration_date: "N/A",
  customs_clearance_date: "N/A",
  importer: {
    cnpj: "N/A",
    company_name: "N/A",
    address: "N/A"
  },
  shipper: {
    name: "N/A",
    country: "N/A"
  },
  cargo: {
    description: "N/A",
    gross_weight_kg: 0,
    net_weight_kg: 0,
    volume_m3: 0,
    packages: 0,
    packaging_type: "N/A"
  },
  transport: {
    modality: "N/A",
    vessel_name: "N/A",
    bill_of_lading: "N/A",
    container_numbers: [],
    port_of_loading: "N/A",
    port_of_discharge: "N/A"
  },
  financial: {
    total_declared_value_usd: 0,
    incoterm: "N/A",
    exchange_rate: 0,
    taxes: {
      ii: 0,
      ipi: 0,
      pis: 0,
      cofins: 0,
      icms: 0
    }
  },
  ncm_codes: [],
  documents: [],
  status: "Pendente"
};

async function analyzeWithAI(text: string): Promise<DocumentAnalysis> {
  try {
    const openai = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini",
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
          "total_declared_value_usd": number,
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

    const formattedPrompt = await promptTemplate.format({ text });
    const response = await openai.invoke(formattedPrompt);
    
    try {
      const analysis = JSON.parse(response);
      return {
        ...DEFAULT_ANALYSIS,
        ...analysis,
        raw_text: text
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        ...DEFAULT_ANALYSIS,
        raw_text: text
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    return {
      ...DEFAULT_ANALYSIS,
      raw_text: text
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const file = await request.json();

    if (!file.data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    const analysis = await analyzeWithAI(file.data);

    file.data = analysis;

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/document/upload`, file, {
      headers: {  
        'Content-Type': 'application/json',
      }
    })

    console.log(response)

    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Server error: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
} 