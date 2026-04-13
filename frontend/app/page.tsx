'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ConfigForm from '@/components/ConfigForm';
import NICCard from '@/components/NICCard';
import NetworkDiagram from '@/components/NetworkDiagram';
import EditableBOMTable from '@/components/EditableBOMTable';
import ValidationPanel from '@/components/ValidationPanel';
import { ServerConfig, ConfigResult, BOMItem } from '@/lib/types';
import { mockConfigResult } from '@/lib/mockData';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';

export default function Home() {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [result, setResult] = useState<ConfigResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = async (serverConfig: ServerConfig) => {
    setConfig(serverConfig);
    setIsLoading(true);
    setStep('result');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult(mockConfigResult);
    setIsLoading(false);
  };

  const handleBack = () => {
    setStep('form');
    setResult(null);
  };

  const handleEditBOM = (item: BOMItem) => {
    console.log('Edit item:', item);
  };

  const handleAddBOM = (type: BOMItem['type']) => {
    console.log('Add item type:', type);
  };

  const handleDeleteBOM = (itemId: string) => {
    console.log('Delete item:', itemId);
  };

  const handleRecalculate = () => {
    console.log('Recalculate BOM');
  };

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
    }, 2000);
  };

  const handleExport = () => {
    console.log('Export to Excel');
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {step === 'form' ? (
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold mb-4">
                NVIDIA <span className="text-[#76B900]">智算设备配置系统</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                根据您的GPU服务器配置，智能推荐ConnectX网卡、组网方案及完整设备清单
              </p>
            </div>
            <ConfigForm onSubmit={handleSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-6">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                返回配置
              </Button>
              <h1 className="text-2xl font-bold">配置方案结果</h1>
              <div className="w-24"></div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#76B900]"></div>
                <p className="text-gray-400 text-lg">正在使用LangChain生成配置方案...</p>
              </div>
            ) : result ? (
              <>
                <NICCard data={result.nicRecommendation} />
                <NetworkDiagram data={result.networkDesign} />
                <EditableBOMTable
                  items={result.bomList}
                  onEdit={handleEditBOM}
                  onAdd={handleAddBOM}
                  onDelete={handleDeleteBOM}
                  onRecalculate={handleRecalculate}
                  onValidate={handleValidate}
                  onExport={handleExport}
                />
                <ValidationPanel
                  report={result.validationReport}
                  isLoading={isValidating}
                />
              </>
            ) : null}
          </div>
        )}
      </main>
    </div>
  );
}
