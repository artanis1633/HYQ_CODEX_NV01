import { BOMItem } from './types';

export interface ProductCatalogEntry {
  type: BOMItem['type'];
  name: string;
  fullModel: string;
  link: string;
  portCount?: number;
  portType?: string;
  speed?: string;
  distance?: string;
  cableType?: string;
  length?: string;
  interfaceType?: string;
}

export const PRODUCT_CATALOG: Record<BOMItem['type'], ProductCatalogEntry[]> = {
  nic: [
    {
      type: 'nic',
      name: '单端口高性能网卡',
      fullModel: 'ConnectX-7 MCX753105AAS-HEAT',
      portCount: 1,
      portType: 'OSFP',
      speed: '400G',
      link: 'https://docs.nvidia.com/networking/display/connectx7vpi'
    },
    {
      type: 'nic',
      name: '双端口高性能网卡',
      fullModel: 'ConnectX-7 MCX75310AAS-HEAT',
      portCount: 2,
      portType: 'OSFP',
      speed: '400G',
      link: 'https://docs.nvidia.com/networking/display/connectx7vpi'
    },
    {
      type: 'nic',
      name: '单端口 200G 网卡',
      fullModel: 'ConnectX-6 MCX653105A-ECAT',
      portCount: 1,
      portType: 'QSFP56',
      speed: '200G',
      link: 'https://docs.nvidia.com/networking/display/connectx6vpi'
    },
    {
      type: 'nic',
      name: '推理型网卡',
      fullModel: 'ConnectX-6 Lx MCX623106AN-CDAT',
      portCount: 2,
      portType: 'QSFP56',
      speed: '200G',
      link: 'https://docs.nvidia.com/networking/display/connectx6lxen'
    }
  ],
  dpu: [
    {
      type: 'dpu',
      name: 'BlueField DPU',
      fullModel: 'BlueField-3 B3220',
      portCount: 2,
      portType: 'QSFP112',
      speed: '400G',
      link: 'https://www.nvidia.com/en-us/networking/products/data-processing-unit/'
    }
  ],
  switch: [
    {
      type: 'switch',
      name: 'InfiniBand 交换机',
      fullModel: 'MQM9790-NS2F',
      portCount: 64,
      portType: 'OSFP',
      speed: '400G',
      link: 'https://www.nvidia.com/en-us/networking/quantum2/'
    },
    {
      type: 'switch',
      name: 'Quantum-2 交换机',
      fullModel: 'MQM9700-NS2F',
      portCount: 64,
      portType: 'OSFP',
      speed: '400G',
      link: 'https://www.nvidia.com/en-us/networking/quantum2/'
    },
    {
      type: 'switch',
      name: 'RoCE 400G 交换机',
      fullModel: 'MSN4700-WS2F',
      portCount: 64,
      portType: 'OSFP',
      speed: '400G',
      link: 'https://www.nvidia.com/en-us/networking/ethernet-switching/'
    },
    {
      type: 'switch',
      name: 'RoCE 200G 交换机',
      fullModel: 'SN3700',
      portCount: 64,
      portType: 'QSFP56',
      speed: '200G',
      link: 'https://www.nvidia.com/en-us/networking/ethernet-switching/'
    }
  ],
  transceiver: [
    {
      type: 'transceiver',
      name: '400G DR4 OSFP 光模块',
      fullModel: 'MMA4Z00-NS',
      portType: 'OSFP',
      speed: '400G',
      distance: '500m',
      link: 'https://www.nvidia.com/en-us/networking/interconnect/'
    },
    {
      type: 'transceiver',
      name: '400G FR4 OSFP 光模块',
      fullModel: 'MMS4X00-NS',
      portType: 'OSFP',
      speed: '400G',
      distance: '2km',
      link: 'https://www.nvidia.com/en-us/networking/interconnect/'
    },
    {
      type: 'transceiver',
      name: '200G FR4 QSFP56 光模块',
      fullModel: '200G FR4 QSFP56',
      portType: 'QSFP56',
      speed: '200G',
      distance: '2km',
      link: 'https://www.nvidia.com/en-us/networking/interconnect/'
    }
  ],
  cable: [
    {
      type: 'cable',
      name: '400G DAC',
      fullModel: 'MCP7Y10-Nxxx',
      cableType: '直连铜缆',
      length: '3m',
      interfaceType: 'OSFP-OSFP',
      speed: '400G',
      link: 'https://www.nvidia.com/en-us/networking/interconnect/'
    },
    {
      type: 'cable',
      name: '400G AOC',
      fullModel: 'MFA7U10-Hxxx',
      cableType: '有源光缆',
      length: '10m',
      interfaceType: 'OSFP-OSFP',
      speed: '400G',
      link: 'https://www.nvidia.com/en-us/networking/interconnect/'
    },
    {
      type: 'cable',
      name: '200G AOC',
      fullModel: 'NVIDIA 200G AOC',
      cableType: '有源光缆',
      length: '10m',
      interfaceType: 'QSFP56-QSFP56',
      speed: '200G',
      link: 'https://www.nvidia.com/en-us/networking/interconnect/'
    },
    {
      type: 'cable',
      name: '光纤跳线',
      fullModel: 'LC/MPO 光纤跳线',
      cableType: '无源光纤',
      length: '30m',
      interfaceType: '光模块-光模块',
      link: 'https://www.nvidia.com/en-us/networking/interconnect/'
    }
  ]
};

export function createBOMItemFromCatalog(
  entry: ProductCatalogEntry,
  quantity = 1,
  id = `manual-${entry.type}-${Date.now()}`
): BOMItem {
  return {
    id,
    type: entry.type,
    name: entry.name,
    fullModel: entry.fullModel,
    quantity,
    portCount: entry.portCount,
    portType: entry.portType,
    speed: entry.speed,
    distance: entry.distance,
    cableType: entry.cableType,
    length: entry.length,
    interfaceType: entry.interfaceType,
    link: entry.link,
    isEditable: true
  };
}
