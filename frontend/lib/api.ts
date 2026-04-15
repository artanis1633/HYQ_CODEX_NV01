import { ConfigResult, ServerConfig } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000/api/v1';

type BackendStatusResponse = {
  status: 'processing' | 'completed' | 'failed';
  result?: {
    nic_recommendation: {
      full_model: string;
      port_count: number;
      port_type: string;
      speed: string;
      count_per_server: number;
      fabric_type: ConfigResult['nicRecommendation']['fabricType'];
      per_server_adapters?: Array<{
        device_type: 'nic' | 'dpu';
        full_model: string;
        quantity: number;
        role: string;
        speed: string;
        port_type: string;
      }>;
      planning_notes?: string[];
      explanation: string;
      official_links: string[];
    };
    network_design: {
      fabric_type: ConfigResult['networkDesign']['fabricType'];
      switch_type: string;
      architecture_type: string;
      architecture_description: string;
      high_availability_design: string;
      performance_estimate: Record<string, string>;
      scalability_suggestions: string;
      gpu_context_summary: string;
      bandwidth_analysis_summary: string;
      bandwidth_tier: string;
      single_server_network_bandwidth: string;
      nic_sizing_rationale?: string[];
      analysis_source: string;
      cabling_guidance?: string[];
      reference_links: string[];
    };
    bom_list: Array<{
      id: string;
      type: 'nic' | 'dpu' | 'switch' | 'transceiver' | 'cable';
      name: string;
      full_model: string;
      quantity: number;
      port_count?: number;
      port_type?: string;
      speed?: string;
      distance?: string;
      cable_type?: string;
      length?: string;
      interface_type?: string;
      link: string;
      isEditable?: boolean;
    }>;
    validation_report?: {
      validation_score: number;
      issues: Array<{
        severity: 'error' | 'warning' | 'info';
        message: string;
        suggestion?: string;
      }>;
      optimization_suggestions?: string[];
      configuration_rationale?: string;
    };
  };
  error?: string;
};

function mapConfigResult(payload: NonNullable<BackendStatusResponse['result']>): ConfigResult {
  const performanceEstimate = payload.network_design.performance_estimate;
  const performanceText = Object.entries(performanceEstimate)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' | ');

  return {
    nicRecommendation: {
      fullModel: payload.nic_recommendation.full_model,
      portCount: payload.nic_recommendation.port_count,
      portType: payload.nic_recommendation.port_type,
      speed: payload.nic_recommendation.speed,
      countPerServer: payload.nic_recommendation.count_per_server,
      fabricType: payload.nic_recommendation.fabric_type,
      perServerAdapters: (payload.nic_recommendation.per_server_adapters ?? []).map((adapter, idx) => ({
        id: `adapter-${idx + 1}`,
        deviceType: adapter.device_type,
        fullModel: adapter.full_model,
        quantity: adapter.quantity,
        role: adapter.role,
        speed: adapter.speed,
        portType: adapter.port_type,
        isEditable: true
      })),
      planningNotes: payload.nic_recommendation.planning_notes ?? [],
      explanation: payload.nic_recommendation.explanation,
      officialLinks: payload.nic_recommendation.official_links
    },
    networkDesign: {
      fabricType: payload.network_design.fabric_type,
      switchType: payload.network_design.switch_type,
      architecture: payload.network_design.architecture_description || payload.network_design.architecture_type,
      highAvailability: payload.network_design.high_availability_design,
      performanceEstimate: performanceText,
      scalability: payload.network_design.scalability_suggestions,
      gpuContextSummary: payload.network_design.gpu_context_summary,
      bandwidthAnalysisSummary: payload.network_design.bandwidth_analysis_summary,
      bandwidthTier: payload.network_design.bandwidth_tier,
      singleServerNetworkBandwidth: payload.network_design.single_server_network_bandwidth,
      nicSizingRationale: payload.network_design.nic_sizing_rationale ?? [],
      analysisSource: payload.network_design.analysis_source,
      cablingGuidance: payload.network_design.cabling_guidance ?? [],
      referenceLinks: payload.network_design.reference_links
    },
    bomList: payload.bom_list.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      fullModel: item.full_model,
      quantity: item.quantity,
      portCount: item.port_count,
      portType: item.port_type,
      speed: item.speed,
      distance: item.distance,
      cableType: item.cable_type,
      length: item.length,
      interfaceType: item.interface_type,
      link: item.link,
      isEditable: item.isEditable ?? true
    })),
    validationReport: payload.validation_report
      ? {
          overallScore: payload.validation_report.validation_score,
          issues: payload.validation_report.issues,
          configurationBasis: [
            payload.validation_report.configuration_rationale ?? '',
            ...(payload.validation_report.optimization_suggestions ?? [])
          ].filter(Boolean),
          referenceDocs: payload.network_design.reference_links
        }
      : undefined
  };
}

function toBackendRequest(config: ServerConfig) {
  return {
    server_count: config.serverCount,
    gpu_configs: config.gpuConfigs.map((gpu) => ({
      model: gpu.model,
      count: gpu.count,
      interconnect: gpu.interconnect
    })),
    use_case: config.useCase,
    fabric_type: config.fabricType,
    dpu_policy: config.dpuPolicy,
    server_to_switch_distance_meters: config.serverToSwitchDistanceMeters,
    switch_to_switch_distance_meters: config.switchToSwitchDistanceMeters,
    link_preference: config.linkPreference
  };
}

function toBackendResult(result: ConfigResult) {
  return {
    nic_recommendation: {
      full_model: result.nicRecommendation.fullModel,
      port_count: result.nicRecommendation.portCount,
      port_type: result.nicRecommendation.portType,
      speed: result.nicRecommendation.speed,
      count_per_server: result.nicRecommendation.countPerServer,
      fabric_type: result.nicRecommendation.fabricType,
      per_server_adapters: result.nicRecommendation.perServerAdapters.map((adapter) => ({
        device_type: adapter.deviceType,
        full_model: adapter.fullModel,
        quantity: adapter.quantity,
        role: adapter.role,
        speed: adapter.speed,
        port_type: adapter.portType
      })),
      planning_notes: result.nicRecommendation.planningNotes,
      explanation: result.nicRecommendation.explanation,
      official_links: result.nicRecommendation.officialLinks
    },
    network_design: {
      fabric_type: result.networkDesign.fabricType,
      switch_type: result.networkDesign.switchType,
      architecture_type: result.networkDesign.architecture,
      architecture_description: result.networkDesign.architecture,
      high_availability_design: result.networkDesign.highAvailability,
      performance_estimate: {
        summary: result.networkDesign.performanceEstimate
      },
      scalability_suggestions: result.networkDesign.scalability,
      gpu_context_summary: result.networkDesign.gpuContextSummary,
      bandwidth_analysis_summary: result.networkDesign.bandwidthAnalysisSummary,
      bandwidth_tier: result.networkDesign.bandwidthTier,
      single_server_network_bandwidth: result.networkDesign.singleServerNetworkBandwidth,
      nic_sizing_rationale: result.networkDesign.nicSizingRationale,
      analysis_source: result.networkDesign.analysisSource,
      cabling_guidance: result.networkDesign.cablingGuidance,
      reference_links: result.networkDesign.referenceLinks
    },
    bom_list: result.bomList.map((item) => ({
      id: item.id,
      type: item.type,
      name: item.name,
      full_model: item.fullModel,
      quantity: item.quantity,
      port_count: item.portCount,
      port_type: item.portType,
      speed: item.speed,
      distance: item.distance,
      cable_type: item.cableType,
      length: item.length,
      interface_type: item.interfaceType,
      link: item.link,
      isEditable: item.isEditable
    })),
    validation_report: result.validationReport
      ? {
          validation_score: result.validationReport.overallScore,
          issues: result.validationReport.issues,
          optimization_suggestions: result.validationReport.configurationBasis,
          configuration_rationale: result.validationReport.referenceDocs.join(' | ')
        }
      : undefined
  };
}

async function pollTask(taskId: string): Promise<ConfigResult> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const response = await fetch(`${API_BASE_URL}/status/${taskId}`, {
      method: 'GET',
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`状态查询失败: ${response.status}`);
    }

    const payload = (await response.json()) as BackendStatusResponse;
    if (payload.status === 'completed' && payload.result) {
      return mapConfigResult(payload.result);
    }
    if (payload.status === 'failed') {
      throw new Error(payload.error || '后端任务执行失败');
    }

    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  throw new Error('后端任务超时，请稍后重试');
}

export async function requestConfiguration(config: ServerConfig): Promise<ConfigResult> {
  const response = await fetch(`${API_BASE_URL}/configure`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(toBackendRequest(config))
  });

  if (!response.ok) {
    throw new Error(`配置提交失败: ${response.status}`);
  }

  const payload = (await response.json()) as { task_id: string };
  return pollTask(payload.task_id);
}

export async function exportConfigurationExcel(config: ServerConfig, result: ConfigResult): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/export/excel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      input_config: toBackendRequest(config),
      result: toBackendResult(result),
      filename_prefix: `nvidia-config-${config.fabricType.toLowerCase()}`
    })
  });

  if (!response.ok) {
    throw new Error(`Excel 导出失败: ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `nvidia-config-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}
