export interface MetricItem {
  val: string;
  delta: string;
  status: "up" | "down" | "neutral";
  subtext: string;
}

export interface NationalData {
  penduduk: string;
  ipm: string;
  kemiskinan: string;
  pengangguran: string;
  pertumbuhan_ekonomi: string;
  inflasi: string;
}

export interface DashboardSummary {
  sulteng: {
    penduduk: MetricItem;
    ipm: MetricItem;
    kemiskinan: MetricItem;
    pengangguran: MetricItem;
    pertumbuhan_ekonomi: MetricItem;
    inflasi: MetricItem;
  };
  nasional: NationalData;
}

export interface Regency {
  Kode: string;
  Wilayah: string;
  Tipe: string;
  Lat: number;
  Lon: number;
  Penduduk_Ribu: number;
  PDRB_Triliun: number;
  Pertumbuhan_PDRB: number;
  IPM: number;
  Kemiskinan_Persen: number;
  Pengangguran_Persen: number;
  NTP: number;
}

export interface AiInsight {
  summary: string;
  trend: string;
  best_region: string;
  lowest_region: string;
  recommendation: string;
}

// Machine Learning Types
export interface ForecastPoint {
  tahun: number;
  prediksi: number;
  upper_bound: number;
  lower_bound: number;
}

export interface HistoricalPoint {
  tahun: number;
  nilai: number;
}

export interface ForecastResponse {
  kode: string;
  wilayah: string;
  tipe: string;
  indicator_key: string;
  data: {
    nama: string;
    unit: string;
    mape: number;
    confidence_level: string;
    model: string;
    historical: HistoricalPoint[];
    forecast: ForecastPoint[];
    insight: string;
  };
}

export interface ClusterRegion {
  kode: string;
  wilayah: string;
  cluster_id: number;
  cluster_name: string;
  cluster_badge: string;
  cluster_color: string;
  pca_x: number;
  pca_y: number;
  ipm: number;
  pdrb: number;
  kemiskinan: number;
  tpt: number;
  ntp: number;
  penduduk: number;
}

export interface ClusterDefinition {
  name: string;
  badge: string;
  color: string;
  desc: string;
  karakteristik: string;
}

export interface ClustersResponse {
  cluster_definitions: Record<string, ClusterDefinition>;
  regions: ClusterRegion[];
  summary: string;
}

export interface AnomalyItem {
  kode: string;
  wilayah: string;
  indicator: string;
  severity: string;
  score: number;
  is_anomaly: boolean;
  explanation: string;
  recommendation: string;
}

export interface AnomalyResponse {
  total_checked: number;
  anomalies_detected: number;
  model: string;
  anomalies: AnomalyItem[];
}

export interface ShapFactor {
  factor: string;
  contribution: string;
  value_raw: string;
}

export interface PolicySimResponse {
  scenario: {
    edu_invest_miliar: number;
    infra_invest_miliar: number;
    industry_projects: number;
    umkm_assistance_units: number;
  };
  baseline: {
    ipm: number;
    kemiskinan: number;
    pdrb_growth: number;
    pengangguran: number;
  };
  simulated: {
    ipm: number;
    delta_ipm: string;
    kemiskinan: number;
    delta_kemiskinan: string;
    pdrb_growth: number;
    delta_pdrb_growth: string;
  };
  shap_breakdown: ShapFactor[];
  ai_narrative: string;
  disclaimer: string;
}
