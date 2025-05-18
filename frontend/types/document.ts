export interface DocumentAnalysis {
  di_number: string;
  registration_date: string;
  customs_clearance_date: string;
  importer: { cnpj: string; company_name: string; address: string };
  shipper: { name: string; country: string };
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
    total_declared_value: number;
    tax_percentage: number;
    amount_paid: number;
    incoterm: string;
    exchange_rate: number;
    taxes: { ii: number; ipi: number; pis: number; cofins: number; icms: number };
  };
  ncm_codes: Array<{
    ncm: string;
    description: string;
    quantity: number;
    unit: string;
    unit_value_usd: number;
  }>;
  documents: Array<{
    type: string;
    number: string;
    date: string;
    issuer?: string;
  }>;
  status: string;
  observations?: string;
  raw_text?: string;
}

export const DEFAULT_ANALYSIS: DocumentAnalysis = {
  di_number: "N/A",
  registration_date: "N/A",
  customs_clearance_date: "N/A",
  importer: { cnpj: "N/A", company_name: "N/A", address: "N/A" },
  shipper: { name: "N/A", country: "N/A" },
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
    total_declared_value: 0,
    tax_percentage: 0,
    amount_paid: 0,
    incoterm: "N/A",
    exchange_rate: 0,
    taxes: { ii: 0, ipi: 0, pis: 0, cofins: 0, icms: 0 }
  },
  ncm_codes: [],
  documents: [],
  status: "Pendente"
};