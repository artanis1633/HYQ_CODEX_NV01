export interface GPUConfig {
  model: string;
  count: number;
  interconnect: 'NVLink' | 'NVSwitch' | 'PCIe';
}

export interface ServerConfig {
  serverCount: number;
  gpuConfigs: GPUConfig[];
  useCase: string;
}

export interface NICRecommendation {
  fullModel: string;
  portCount: number;
  portType: string;
  speed: string;
  countPerServer: number;
  explanation: string;
  officialLinks: string[];
}

export interface NetworkDesign {
  architecture: string;
  highAvailability: string;
  performanceEstimate: string;
  scalability: string;
  referenceLinks: string[];
}

export interface BOMItem {
  id: string;
  type: 'nic' | 'switch' | 'transceiver' | 'cable';
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
