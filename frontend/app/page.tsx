'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ConfigForm from '@/components/ConfigForm';
import NICCard from '@/components/NICCard';
import NetworkDiagram from '@/components/NetworkDiagram';
import EditableBOMTable from '@/components/EditableBOMTable';
import BOMItemEditor from '@/components/BOMItemEditor';
import LoadingPipeline from '@/components/LoadingPipeline';
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

const LOADING_STEPS = [
  '正在提交配置任务',
  '正在进行规则计算',
  '正在分析 GPU、互联模式与组网路线',
  '正在尝试 AI 带宽分析',
  '正在生成网卡、交换机与链路清单',
  '正在整理最终结果'
] as const;

export default function Home() {
  const [step, setStep] = useState<'form' | 'result'>('form');
  const [config, setConfig] = useState<ServerConfig | null>(null);
  const [result, setResult] = useState<ConfigResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [loadMessage, setLoadMessage] = useState('正在生成配置方案...');
  const [loadNotice, setLoadNotice] = useState<string | null>(null);
  const [loadingStepIndex, setLoadingStepIndex] = useState(0);
  const [bomEditor, setBomEditor] = useState<BomEditorState>(null);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    setLoadingStepIndex(0);
    const interval = window.setInterval(() => {
      setLoadingStepIndex((current) => Math.min(current + 1, LOADING_STEPS.length - 1));
    }, 1400);

    return () => window.clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = async (serverConfig: ServerConfig) => {
    setConfig(serverConfig);
    setIsLoading(true);
    setStep('result');
    setLoadNotice(null);
    setLoadingStepIndex(0);

    try {
      setLoadMessage('配置引擎正在按流水线生成结果，请稍候...');
      const liveResult = await requestConfiguration(serverConfig);
      setLoadingStepIndex(LOADING_STEPS.length - 1);
      setResult(liveResult);
    } catch (error) {
      console.error('Falling back to mock result:', error);
      const message = error instanceof Error ? error.message : String(error);
      const timeoutLike = /超时|timeout|timed out/i.test(message);
      setLoadNotice(timeoutLike ? 'AI 响应超时，已切换本地规则继续生成结果。' : '后端暂不可用，已切换到本地演示结果。');
      setLoadMessage(timeoutLike ? '外部分析较慢，正在回退到本地规则...' : '后端暂不可用，已切换到本地演示结果...');
      setLoadingStepIndex(3);
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
              <LoadingPipeline
                steps={[...LOADING_STEPS]}
                currentStep={loadingStepIndex}
                title="配置清单生成中"
                description={loadMessage}
                notice={loadNotice}
              />
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
