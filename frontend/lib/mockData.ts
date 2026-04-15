import { ConfigResult, ServerConfig } from './types';

const DEFAULT_REFERENCE_LINKS = [
  "https://www.nvidia.com/en-us/data-center/networking/",
  "https://docs.nvidia.com/networking/"
];

function getNicModel(config: ServerConfig) {
  const isTraining = config.useCase === 'AI_training';
  const hasHighPerformanceInterconnect = config.gpuConfigs.some(
    (gpu) => gpu.interconnect === 'NVSwitch' || gpu.interconnect === 'NVLink'
  );

  if (isTraining || hasHighPerformanceInterconnect || config.fabricType === 'InfiniBand') {
    return {
      fullModel: "ConnectX-7 MCX75310AAS-HEAT",
      speed: "400Gbps",
      portType: "OSFP",
      portCount: 2,
      countPerServer: 2,
      officialLinks: [
        "https://www.nvidia.com/en-us/networking/ethernet/adapter-cards/connectx-7/",
        "https://docs.nvidia.com/networking/display/ConnectX7EN"
      ]
    };
  }

  return {
    fullModel: "ConnectX-6 Lx MCX623106AN-CDAT",
    speed: "200Gbps",
    portType: "QSFP56",
    portCount: 2,
    countPerServer: 1,
    officialLinks: [
      "https://www.nvidia.com/en-us/networking/ethernet/adapter-cards/connectx-6-lx/"
    ]
  };
}

function getLinkStrategy(config: ServerConfig) {
  if (config.linkPreference === 'transceiver_priority') {
    return 'transceiver';
  }
  if (config.linkPreference === 'direct_attach_priority') {
    return config.serverToSwitchDistanceMeters <= 3 ? 'dac' : 'aoc';
  }
  if (config.serverToSwitchDistanceMeters <= 3 && config.switchToSwitchDistanceMeters <= 5) {
    return 'dac';
  }
  if (config.serverToSwitchDistanceMeters <= 30 && config.switchToSwitchDistanceMeters <= 30) {
    return 'aoc';
  }
  return 'transceiver';
}

export function generateMockConfigResult(config: ServerConfig): ConfigResult {
  const nic = getNicModel(config);
  const linkStrategy = getLinkStrategy(config);
  const totalNicQuantity = config.serverCount * nic.countPerServer;
  const totalServerFacingPorts = totalNicQuantity * nic.portCount;
  const reservePorts = Math.max(2, Math.ceil(totalServerFacingPorts * 0.1));
  const requiredPorts = totalServerFacingPorts + reservePorts;

  const switchModel =
    config.fabricType === 'InfiniBand'
      ? {
          name: "InfiniBand交换机",
          type: "Quantum InfiniBand",
          fullModel: "NVIDIA Quantum-2 QM9700",
          portCount: 64,
          link: "https://www.nvidia.com/en-us/networking/infiniband/switches/quantum-2/"
        }
      : {
          name: "RoCE以太网交换机",
          type: "Spectrum Ethernet",
          fullModel: "NVIDIA Spectrum-X SN4600",
          portCount: 64,
          link: "https://www.nvidia.com/en-us/networking/ethernet/switches/spectrum-x/"
        };

  const switchQuantity = Math.max(2, Math.ceil(requiredPorts / switchModel.portCount));

  const bomList: ConfigResult['bomList'] = [
    {
      id: "nic-1",
      type: "nic",
      name: "服务器数据网卡",
      fullModel: nic.fullModel,
      quantity: totalNicQuantity,
      portCount: nic.portCount,
      portType: nic.portType,
      speed: nic.speed,
      link: nic.officialLinks[0],
      isEditable: true
    },
    {
      id: "switch-1",
      type: "switch",
      name: switchModel.name,
      fullModel: switchModel.fullModel,
      quantity: switchQuantity,
      portCount: switchModel.portCount,
      portType: nic.portType,
      speed: nic.speed,
      link: switchModel.link,
      isEditable: true
    }
  ];

  if (linkStrategy === 'dac') {
    bomList.push({
      id: "cable-1",
      type: "cable",
      name: `${config.fabricType} 铜缆`,
      fullModel: nic.speed.startsWith("400") ? "NVIDIA 400G DAC" : "NVIDIA 200G DAC",
      quantity: totalServerFacingPorts,
      cableType: "直连铜缆 (DAC)",
      length: `${Math.max(1, Math.ceil(config.serverToSwitchDistanceMeters))}m`,
      interfaceType: `${nic.portType}-${nic.portType}`,
      link: "https://www.nvidia.com/en-us/networking/cables/",
      isEditable: true
    });
  } else if (linkStrategy === 'aoc') {
    bomList.push({
      id: "cable-1",
      type: "cable",
      name: `${config.fabricType} 光缆`,
      fullModel: nic.speed.startsWith("400") ? "NVIDIA 400G AOC" : "NVIDIA 200G AOC",
      quantity: totalServerFacingPorts,
      cableType: "有源光缆 (AOC)",
      length: `${Math.max(3, Math.ceil(config.serverToSwitchDistanceMeters))}m`,
      interfaceType: `${nic.portType}-${nic.portType}`,
      link: "https://www.nvidia.com/en-us/networking/cables/",
      isEditable: true
    });
  } else {
    bomList.push(
      {
        id: "transceiver-switch-1",
        type: "transceiver",
        name: "交换机侧光模块",
        fullModel: nic.speed.startsWith("400") ? "400G DR4 OSFP" : "200G FR4 QSFP56",
        quantity: totalServerFacingPorts,
        speed: nic.speed,
        portType: nic.portType,
        distance: `${config.serverToSwitchDistanceMeters}m`,
        link: "https://www.nvidia.com/en-us/networking/transceivers/",
        isEditable: true
      },
      {
        id: "transceiver-host-1",
        type: "transceiver",
        name: "服务器侧光模块",
        fullModel: nic.speed.startsWith("400") ? "400G DR4 OSFP" : "200G FR4 QSFP56",
        quantity: totalServerFacingPorts,
        speed: nic.speed,
        portType: nic.portType,
        distance: `${config.serverToSwitchDistanceMeters}m`,
        link: "https://www.nvidia.com/en-us/networking/transceivers/",
        isEditable: true
      },
      {
        id: "cable-1",
        type: "cable",
        name: "光纤跳线",
        fullModel: "待补充光纤跳线 SKU",
        quantity: Math.max(1, totalServerFacingPorts / 2),
        cableType: "无源光纤",
        length: `${Math.ceil(config.serverToSwitchDistanceMeters)}m`,
        interfaceType: `${nic.portType}-${nic.portType}`,
        link: "https://www.nvidia.com/en-us/networking/cables/",
        isEditable: true
      }
    );
  }

  return {
    nicRecommendation: {
      fullModel: nic.fullModel,
      portCount: nic.portCount,
      portType: nic.portType,
      speed: nic.speed,
      countPerServer: nic.countPerServer,
      fabricType: config.fabricType,
      perServerAdapters: [
        {
          id: "nic-primary",
          deviceType: "nic",
          fullModel: nic.fullModel,
          quantity: nic.countPerServer,
          role: config.useCase === 'AI_training' ? "主数据网卡" : "主业务网卡",
          speed: nic.speed,
          portType: nic.portType,
          isEditable: true
        }
      ],
      planningNotes: [
        "默认不主动配置 DPU，避免对所有用户强制引入 BlueField 方案。",
        "单台服务器适配清单仅作为自动推荐起点，后续可手动删除、替换或混编为 ConnectX + BlueField。",
        `当前组网类型已锁定为 ${config.fabricType}，后续交换机与链路方案将沿用同一技术路线。`
      ],
      explanation:
        config.useCase === 'AI_training'
          ? `针对训练场景和 ${config.fabricType} 组网，当前默认推荐每台服务器部署 ${nic.countPerServer} 张 ${nic.fullModel}。系统默认不强制加入 DPU，但会在后续编辑阶段允许按单机维度混编 BlueField 与 ConnectX。`
          : `针对推理场景，当前默认推荐每台服务器部署 ${nic.countPerServer} 张 ${nic.fullModel}。如果后续需要隔离、卸载或多租场景，可再手动引入 BlueField DPU 进行混编。`,
      officialLinks: nic.officialLinks
    },
    networkDesign: {
      fabricType: config.fabricType,
      switchType: switchModel.type,
      architecture:
        config.fabricType === 'InfiniBand'
          ? "当前按 Quantum InfiniBand 技术路线生成方案，默认采用双平面高带宽互联，适合训练型 GPU 集群。"
          : "当前按 Spectrum RoCE 以太网技术路线生成方案，适合推理或需要兼顾以太网生态的集群。",
      highAvailability: "默认按双链路和交换机冗余预留进行计算，后续可在可编辑清单中继续增删设备并重新校验。",
      performanceEstimate: `单台服务器预计提供 ${nic.countPerServer * nic.portCount} 个 ${nic.speed} ${nic.portType} 端口，总体按 ${switchQuantity} 台交换机承载并预留 10% 端口冗余。`,
      scalability: "当前 demo 阶段优先保证主路径可演示，后续会继续增强分层拓扑、DPU 混编和更精细的端口级校验。",
      cablingGuidance: [
        `服务器到交换机距离按 ${config.serverToSwitchDistanceMeters}m 处理。`,
        `交换机之间距离按 ${config.switchToSwitchDistanceMeters}m 处理。`,
        linkStrategy === 'dac'
          ? "当前链路优先采用 DAC 直连铜缆，原因是距离较短且未强制要求模块化方案。"
          : linkStrategy === 'aoc'
            ? "当前链路优先采用 AOC 有源光缆，避免在中距离场景继续使用铜缆。"
            : "当前链路切换为模块化光连接方案，后续建议继续补充交换机侧和服务器侧模块 SKU。"
      ],
      referenceLinks: DEFAULT_REFERENCE_LINKS
    },
    bomList,
    validationReport: {
      overallScore: linkStrategy === 'transceiver' ? 8.7 : 9.1,
      issues: [
        {
          severity: "info",
          message: `当前方案已按 ${config.fabricType} 技术路线锁定交换设备类型。`,
          suggestion: config.fabricType === 'InfiniBand' ? "后续继续补充 Quantum 设备和 IB 模块规则。" : "后续继续补充 Spectrum 设备和 RoCE 模块规则。"
        },
        {
          severity: "warning",
          message: "DPU 当前默认未自动加入推荐清单。",
          suggestion: "如果你希望在单机维度混编 BlueField，可在后续编辑阶段手动替换或追加。"
        }
      ],
      configurationBasis: [
        "默认不强制引入 DPU，先生成可运行的 ConnectX 主路径方案。",
        "由用户在首页明确选择 InfiniBand 或 ROCE 以太组网路线。",
        "线缆和模块方案优先依据服务器到交换机、交换机到交换机距离来分流。"
      ],
      referenceDocs: DEFAULT_REFERENCE_LINKS
    }
  };
}

export const mockConfigResult = generateMockConfigResult({
  serverCount: 4,
  gpuConfigs: [{ model: 'H100', count: 8, interconnect: 'NVSwitch' }],
  useCase: 'AI_training',
  fabricType: 'InfiniBand',
  dpuPolicy: 'disabled',
  serverToSwitchDistanceMeters: 3,
  switchToSwitchDistanceMeters: 5,
  linkPreference: 'auto'
});
