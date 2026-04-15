'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import ConfigForm from '@/components/ConfigForm';
import NICCard from '@/components/NICCard';
import NetworkDiagram from '@/components/NetworkDiagram';
import EditableBOMTable from '@/components/EditableBOMTable';
import BOMItemEditor from '@/components/BOMItemEditor';
import ValidationPanel from '@/components/ValidationPanel';
import { ServerConfig, ConfigResult, BOMItem } from '@/lib/types';
import { generateMockConfigResult } from '@/lib/mockData';
import { exportConfigurationExcel, requestConfiguration } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/Button';

type BomEditorState =
  | {
      mode: 'add' | 'edit';
      type: BOMItem['type'];
      item?: BOMItem;
    }
  | null;

export default function Home() {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [result, setResult] = useState<ConfigResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [loadMessage, setLoadMessage] = useState('正在生成配置方案...');
  const [bomEditor, setBomEditor] = useState<BomEditorState>(null);

  const handleSubmit = async (serverConfig: ServerConfig) => {
    setConfig(serverConfig);
    setIsLoading(true);
    setStep('result');

    try {
      setLoadMessage('正在调用后端配置引擎...');
      const liveResult = await requestConfiguration(serverConfig);
      setResult(liveResult);
    } catch (error) {
      console.error('Falling back to mock result:', error);
      setLoadMessage('后端暂不可用，已切换到本地演示结果...');
      await new Promise((resolve) => setTimeout(resolve, 800));
      setResult(generateMockConfigResult(serverConfig));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep('form');
    setResult(null);
  };

  const handleEditBOM = (item: BOMItem) => {
    setBomEditor({
      mode: 'edit',
      type: item.type,
      item
    });
  };

  const handleAddBOM = (type: BOMItem['type']) => {
    setBomEditor({
      mode: 'add',
      type
    });
  };

  const handleDeleteBOM = (itemId: string) => {
    setResult((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        bomList: prev.bomList.filter((item) => item.id !== itemId)
      };
    });
  };

  const handleRecalculate = () => {
    if (!config) {
      return;
    }
    setResult((prev) => {
      if (!prev) {
        return prev;
      }
      return {
        ...prev,
        validationReport: prev.validationReport
          ? {
              ...prev.validationReport,
              configurationBasis: [
                ...prev.validationReport.configurationBasis,
                'BOM 已手动调整，当前结果为演示态重算；后续可接入后端二次校验与数量联动。'
              ]
            }
          : prev.validationReport
      };
    });
  };

  const handleValidate = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
    }, 2000);
  };

  const handleExport = async () => {
    if (!config || !result) {
      return;
    }
    setIsExporting(true);
    try {
      await exportConfigurationExcel(config, result);
    } catch (error) {
      console.error('Excel export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveBOMItem = (item: BOMItem) => {
    setResult((prev) => {
      if (!prev) {
        return prev;
      }

      const existingIndex = prev.bomList.findIndex((existing) => existing.id === item.id);
      const nextBomList = [...prev.bomList];

      if (existingIndex >= 0) {
        nextBomList[existingIndex] = item;
      } else {
        nextBomList.push(item);
      }

      return {
        ...prev,
        bomList: nextBomList
      };
    });
    setBomEditor(null);
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
                <p className="text-gray-400 text-lg">{loadMessage}</p>
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
                  isExporting={isExporting}
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
      {bomEditor ? (
        <BOMItemEditor
          mode={bomEditor.mode}
          type={bomEditor.type}
          initialItem={bomEditor.item}
          onClose={() => setBomEditor(null)}
          onSave={handleSaveBOMItem}
        />
      ) : null}
    </div>
  );
}
