import { GPUConfig } from './types';

export function getAllowedInterconnects(model: string): GPUConfig['interconnect'][] {
  if (model.includes('PCIe')) {
    return ['PCIe'];
  }
  if (model.includes('SXM')) {
    return ['NVLink'];
  }
  return ['PCIe', 'NVLink'];
}

export function getLockedInterconnect(model: string): GPUConfig['interconnect'] | null {
  const allowed = getAllowedInterconnects(model);
  return allowed.length === 1 ? allowed[0] : null;
}
