export interface GPUConfig {
  model: string;
  count: number;
  interconnect: 'NVLink' | 'PCIe';
}

export type FabricType = 'InfiniBand' | 'RoCE';
export type DpuPolicy = 'disabled' | 'optional';
export type LinkPreference = 'auto' | 'direct_attach_priority' | 'transceiver_priority';

export interface ServerConfig {
  serverCount: number;
  gpuConfigs: GPUConfig[];
  useCase: string;
  fabricType: FabricType;
  dpuPolicy: DpuPolicy;
  serverToSwitchDistanceMeters: number;
  switchToSwitchDistanceMeters: number;
  linkPreference: LinkPreference;
}

export interface PerServerAdapter {
  id: string;
  deviceType: 'nic' | 'dpu';
  fullModel: string;
  quantity: number;
  role: string;
  speed: string;
  portType: string;
  isEditable?: boolean;
}

export interface NICRecommendation {
  fullModel: string;
  portCount: number;
  portType: string;
  speed: string;
  countPerServer: number;
  fabricType: FabricType;
  perServerAdapters: PerServerAdapter[];
  planningNotes: string[];
  explanation: string;
  officialLinks: string[];
}

export interface NetworkDesign {
  fabricType: FabricType;
  switchType: string;
  architecture: string;
  highAvailability: string;
  performanceEstimate: string;
  scalability: string;
  gpuContextSummary: string;
  bandwidthAnalysisSummary: string;
  bandwidthTier: string;
  singleServerNetworkBandwidth: string;
  nicSizingRationale: string[];
  analysisSource: string;
  cablingGuidance: string[];
  referenceLinks: string[];
}

export interface BOMItem {
  id: string;
  type: 'nic' | 'dpu' | 'switch' | 'transceiver' | 'cable';
  name: string;
  fullModel: string;
  quantity: number;
  portCount?: number;
  portType?: string;
  speed?: string;
  distance?: string;
  cableType?: string;
  length?: string;
  interfaceType?: string;
  link: string;
  isEditable?: boolean;
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  message: string;
  suggestion?: string;
}

export interface ValidationReport {
  overallScore: number;
  issues: ValidationIssue[];
  configurationBasis: string[];
  referenceDocs: string[];
}

export interface ConfigResult {
  nicRecommendation: NICRecommendation;
  networkDesign: NetworkDesign;
  bomList: BOMItem[];
  validationReport?: ValidationReport;
}

export interface BOMEditAction {
  action: 'add' | 'edit' | 'delete' | 'recalculate';
  itemId?: string;
  item?: Partial<BOMItem>;
}
