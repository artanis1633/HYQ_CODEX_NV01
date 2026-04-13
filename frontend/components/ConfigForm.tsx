'use client';

import { useState } from 'react';
import { ServerConfig, GPUConfig } from '@/lib/types';
import { Button } from './Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Plus, Trash2, Cpu, Server, Zap } from 'lucide-react';

const GPU_MODELS = ['H100', 'H200', 'A100', 'A800', 'L40S', 'L4', 'RTX 6000'];
const INTERCONNECT_MODES = ['NVSwitch', 'NVLink', 'PCIe'];
const USE_CASES = ['AI_training', 'AI_inference', 'HPC', 'Data_analytics'];

interface ConfigFormProps {
  onSubmit: (config: ServerConfig) => void;
  isLoading?: boolean;
}

export default function ConfigForm({ onSubmit, isLoading = false }: ConfigFormProps) {
  const [serverCount, setServerCount] = useState(4);
  const [useCase, setUseCase] = useState('AI_training');
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

  const updateGpuConfig = (index: number, field: keyof GPUConfig, value: any) => {
    const newConfigs = [...gpuConfigs];
    newConfigs[index] = { ...newConfigs[index], [field]: value };
    setGpuConfigs(newConfigs);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ serverCount, gpuConfigs, useCase });
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
            <CardDescription>设置服务器基本参数</CardDescription>
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
                onChange={(e) => setServerCount(parseInt(e.target.value) || 1)}
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
              onClick={() => {
                setServerCount(4);
                setUseCase('AI_training');
                setGpuConfigs([{ model: 'H100', count: 8, interconnect: 'NVSwitch' }]);
              }}
            >
              H100 8-GPU 集群 (4台)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setServerCount(1);
                setUseCase('AI_inference');
                setGpuConfigs([{ model: 'L40S', count: 4, interconnect: 'PCIe' }]);
              }}
            >
              L40S 推理工作站 (单机)
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
            <CardDescription>配置每台服务器的GPU信息</CardDescription>
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
                    onChange={(e) => updateGpuConfig(index, 'count', parseInt(e.target.value) || 1)}
                    className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    互联模式
                  </label>
                  <select
                    value={config.interconnect}
                    onChange={(e) => updateGpuConfig(index, 'interconnect', e.target.value as any)}
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

      <div className="flex justify-center">
        <Button type="submit" isLoading={isLoading} className="px-12 py-6 text-lg h-auto">
          {isLoading ? '生成配置方案中...' : '生成配置方案'}
        </Button>
      </div>
    </form>
  );
}
