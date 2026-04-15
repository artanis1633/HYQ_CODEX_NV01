'use client';

import { useState } from 'react';
import { ServerConfig, GPUConfig } from '@/lib/types';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Plus, Trash2, Cpu, Server, Zap, Router, Cable } from 'lucide-react';

const GPU_MODELS = ['H100', 'H200', 'A100', 'A800', 'L40S', 'L4', 'RTX 6000'];
const INTERCONNECT_MODES = ['NVSwitch', 'NVLink', 'PCIe'];
const USE_CASES = ['AI_training', 'AI_inference', 'HPC', 'Data_analytics'];
const FABRIC_TYPES = [
  { value: 'InfiniBand', label: 'InfiniBand 组网' },
  { value: 'RoCE', label: 'ROCE 以太组网' }
] as const;
const LINK_PREFERENCES = [
  { value: 'auto', label: '自动判断线缆/模块方案' },
  { value: 'direct_attach_priority', label: '优先直连线缆方案' },
  { value: 'transceiver_priority', label: '优先模块化方案' }
] as const;

interface ConfigFormProps {
  onSubmit: (config: ServerConfig) => void;
  isLoading?: boolean;
}

export default function ConfigForm({ onSubmit, isLoading = false }: ConfigFormProps) {
  const [serverCount, setServerCount] = useState(4);
  const [useCase, setUseCase] = useState('AI_training');
  const [fabricType, setFabricType] = useState<ServerConfig['fabricType']>('InfiniBand');
  const [dpuPolicy] = useState<ServerConfig['dpuPolicy']>('disabled');
  const [serverToSwitchDistanceMeters, setServerToSwitchDistanceMeters] = useState(3);
  const [switchToSwitchDistanceMeters, setSwitchToSwitchDistanceMeters] = useState(5);
  const [linkPreference, setLinkPreference] = useState<ServerConfig['linkPreference']>('auto');
  const [gpuConfigs, setGpuConfigs] = useState<GPUConfig[]>([
    { model: 'H100', count: 8, interconnect: 'NVSwitch' }
  ]);

  const addGpuConfig = () => {
    setGpuConfigs([...gpuConfigs, { model: 'H100', count: 4, interconnect: 'NVLink' }]);
  };

  const removeGpuConfig = (index: number) => {
    if (gpuConfigs.length > 1) {
      setGpuConfigs(gpuConfigs.filter((_, i) => i !== index));
    }
  };

  const updateGpuConfig = (index: number, field: keyof GPUConfig, value: string | number) => {
    const newConfigs = [...gpuConfigs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setGpuConfigs(newConfigs);
  };

  const applyPreset = (preset: {
    serverCount: number;
    useCase: string;
    fabricType: ServerConfig['fabricType'];
    serverToSwitchDistanceMeters: number;
    switchToSwitchDistanceMeters: number;
    linkPreference: ServerConfig['linkPreference'];
    gpuConfigs: GPUConfig[];
  }) => {
    setServerCount(preset.serverCount);
    setUseCase(preset.useCase);
    setFabricType(preset.fabricType);
    setServerToSwitchDistanceMeters(preset.serverToSwitchDistanceMeters);
    setSwitchToSwitchDistanceMeters(preset.switchToSwitchDistanceMeters);
    setLinkPreference(preset.linkPreference);
    setGpuConfigs(preset.gpuConfigs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      serverCount,
      gpuConfigs,
      useCase,
      fabricType,
      dpuPolicy,
      serverToSwitchDistanceMeters,
      switchToSwitchDistanceMeters,
      linkPreference
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-nvidia-green" />
              <CardTitle className="text-lg">基础配置</CardTitle>
            </div>
            <CardDescription>设置服务器基本参数、组网路线和默认 DPU 策略</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                服务器数量
              </label>
              <input
                type="number"
                min="1"
                value={serverCount}
                onChange={(e) => setServerCount(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                应用场景
              </label>
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              >
                {USE_CASES.map((uc) => (
                  <option key={uc} value={uc}>{uc.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                组网类型
              </label>
              <select
                value={fabricType}
                onChange={(e) => setFabricType(e.target.value as ServerConfig['fabricType'])}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              >
                {FABRIC_TYPES.map((fabric) => (
                  <option key={fabric.value} value={fabric.value}>{fabric.label}</option>
                ))}
              </select>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-3 text-sm text-gray-400">
              当前默认不自动配置 DPU，系统会先给出 ConnectX 主路径方案。后续你可以在结果页按单机维度手动混编 BlueField DPU。
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-nvidia-green" />
              <CardTitle className="text-lg">快速预览</CardTitle>
            </div>
            <CardDescription>加载示例配置体验界面</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => applyPreset({
                serverCount: 4,
                useCase: 'AI_training',
                fabricType: 'InfiniBand',
                serverToSwitchDistanceMeters: 3,
                switchToSwitchDistanceMeters: 5,
                linkPreference: 'auto',
                gpuConfigs: [{ model: 'H100', count: 8, interconnect: 'NVSwitch' }]
              })}
            >
              H100 8-GPU 训练集群 (InfiniBand)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => applyPreset({
                serverCount: 1,
                useCase: 'AI_inference',
                fabricType: 'RoCE',
                serverToSwitchDistanceMeters: 8,
                switchToSwitchDistanceMeters: 15,
                linkPreference: 'auto',
                gpuConfigs: [{ model: 'L40S', count: 4, interconnect: 'PCIe' }]
              })}
            >
              L40S 推理工作站 (ROCE)
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-nvidia-green" />
              <CardTitle className="text-lg">GPU 配置</CardTitle>
            </div>
            <CardDescription>配置每台服务器的 GPU 信息</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addGpuConfig}
          >
            <Plus className="h-4 w-4 mr-1" /> 添加
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gpuConfigs.map((config, index) => (
              <div key={index} className="flex flex-wrap gap-4 items-end p-4 border border-gray-700 rounded-lg bg-gray-800/50">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    GPU 型号 {index + 1}
                  </label>
                  <select
                    value={config.model}
                    onChange={(e) => updateGpuConfig(index, 'model', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
                  >
                    {GPU_MODELS.map((model) => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    数量
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="32"
                    value={config.count}
                    onChange={(e) => updateGpuConfig(index, 'count', parseInt(e.target.value, 10) || 1)}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    互联模式
                  </label>
                  <select
                    value={config.interconnect}
                    onChange={(e) => updateGpuConfig(index, 'interconnect', e.target.value)}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
                  >
                    {INTERCONNECT_MODES.map((mode) => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeGpuConfig(index)}
                  disabled={gpuConfigs.length <= 1}
                  className="text-red-400 border-red-900 hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Router className="h-5 w-5 text-nvidia-green" />
              <CardTitle className="text-lg">组网约束</CardTitle>
            </div>
            <CardDescription>明确 IB 或 ROCE 路线，后续交换设备会按此技术路线生成</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                链路策略
              </label>
              <select
                value={linkPreference}
                onChange={(e) => setLinkPreference(e.target.value as ServerConfig['linkPreference'])}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              >
                {LINK_PREFERENCES.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </div>
            <div className="rounded-lg border border-gray-800 bg-gray-800/40 p-3 text-sm text-gray-400">
              `InfiniBand` 将优先生成 Quantum 交换设备，`ROCE` 将优先生成 Spectrum 以太交换设备。
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Cable className="h-5 w-5 text-nvidia-green" />
              <CardTitle className="text-lg">线缆距离约束</CardTitle>
            </div>
            <CardDescription>先用关键距离约束引导 AOC / DAC / 模块化光连接方案</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                服务器到交换机距离 (m)
              </label>
              <input
                type="number"
                min="1"
                value={serverToSwitchDistanceMeters}
                onChange={(e) => setServerToSwitchDistanceMeters(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                交换机之间距离 (m)
              </label>
              <input
                type="number"
                min="1"
                value={switchToSwitchDistanceMeters}
                onChange={(e) => setSwitchToSwitchDistanceMeters(parseInt(e.target.value, 10) || 1)}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              />
            </div>
            <div className="md:col-span-2 rounded-lg border border-yellow-900/50 bg-yellow-950/20 p-3 text-sm text-yellow-200/80">
              当前规则会优先按距离做粗粒度判断：短距优先 DAC，中距优先 AOC，超出直连光缆舒适区时再切换到模块化方案。后续我们再继续细化单模、多模以及交换机侧/服务器侧模块差异。
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button type="submit" isLoading={isLoading} className="px-12 py-6 text-lg h-auto">
          {isLoading ? '生成配置方案中...' : '生成配置方案'}
        </Button>
      </div>
    </form>
  );
}
