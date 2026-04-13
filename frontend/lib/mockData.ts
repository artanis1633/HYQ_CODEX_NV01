import { ConfigResult } from './types';

export const mockConfigResult: ConfigResult = {
  nicRecommendation: {
    fullModel: "ConnectX-7 MCX75310AAS-HEAT",
    portCount: 2,
    portType: "OSFP",
    speed: "400Gbps",
    countPerServer: 2,
    explanation: "针对H100 8-GPU配置，推荐使用ConnectX-7 MCX75310AAS-HEAT网卡。该网卡提供2个400Gbps OSFP端口，能够充分满足H100 GPU集群的高带宽需求。每台服务器配置2张网卡可实现冗余和负载均衡，配合NVSwitch架构可最大化集群性能。",
    officialLinks: [
      "https://www.nvidia.com/en-us/networking/ethernet/adapter-cards/connectx-7/",
      "https://docs.nvidia.com/networking/display/ConnectX7EN"
    ]
  },
  networkDesign: {
    architecture: "采用2层胖树(Fat-Tree)拓扑架构。计算节点通过Leaf交换机连接，Leaf交换机之间通过Spine交换机互联。此架构支持线性扩展，适合中大规模AI训练集群。",
    highAvailability: "所有网络设备采用N+1冗余设计。计算节点双网卡绑定，交换机采用MLAG技术实现跨设备链路聚合，确保单点故障不影响集群运行。",
    performanceEstimate: "单节点网络带宽可达800Gbps(2x400Gbps)，节点间延迟低于1.5微秒。GPU Direct RDMA技术可实现GPU内存直接访问，大幅提升通信效率。",
    scalability: "当前配置可支持最多64台服务器。如需扩展至更大规模，可增加Spine交换机数量或升级至3层CLOS架构。",
    referenceLinks: [
      "https://www.nvidia.com/en-us/data-center/networking/"
    ]
  },
  bomList: [
    {
      id: "nic-1",
      type: "nic",
      name: "网卡",
      fullModel: "ConnectX-7 MCX75310AAS-HEAT",
      quantity: 8,
      portCount: 2,
      portType: "OSFP",
      speed: "400Gbps",
      link: "https://www.nvidia.com/en-us/networking/ethernet/adapter-cards/connectx-7/",
      isEditable: true
    },
    {
      id: "switch-1",
      type: "switch",
      name: "InfiniBand交换机",
      fullModel: "NVIDIA Quantum-2 QM9700",
      quantity: 4,
      portCount: 64,
      portType: "OSFP",
      speed: "400Gbps",
      link: "https://www.nvidia.com/en-us/networking/infiniband/switches/quantum-2/",
      isEditable: true
    },
    {
      id: "transceiver-1",
      type: "transceiver",
      name: "光模块",
      fullModel: "400G DR4 OSFP",
      quantity: 32,
      speed: "400Gbps",
      portType: "OSFP",
      distance: "500m",
      link: "https://www.nvidia.com/en-us/networking/transceivers/",
      isEditable: true
    },
    {
      id: "cable-1",
      type: "cable",
      name: "InfiniBand线缆",
      fullModel: "NVIDIA 400G AOC",
      quantity: 32,
      cableType: "有源光缆 (AOC)",
      length: "5m",
      interfaceType: "OSFP-OSFP",
      link: "https://www.nvidia.com/en-us/networking/cables/",
      isEditable: true
    }
  ],
  validationReport: {
    overallScore: 9.2,
    issues: [
      {
        severity: "info",
        message: "配置符合NVIDIA最佳实践",
        suggestion: "当前配置无需修改"
      },
      {
        severity: "warning",
        message: "建议准备10%备用光模块",
        suggestion: "建议增加4个备用光模块"
      }
    ],
    configurationBasis: [
      "基于NVIDIA DGX H100参考架构",
      "遵循NVIDIA Networking最佳实践指南",
      "端口配比1:1计算节点与Leaf交换机"
    ],
    referenceDocs: [
      "https://www.nvidia.com/en-us/data-center/dgx-systems/",
      "https://docs.nvidia.com/networking/"
    ]
  }
};
