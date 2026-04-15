'use client';

import { BOMItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { ListTodo, Plus, Edit2, Trash2, RefreshCw, Download } from 'lucide-react';
import { cn } from './Header';

interface EditableBOMTableProps {
  items: BOMItem[];
  onEdit?: (item: BOMItem) => void;
  onAdd?: (type: BOMItem['type']) => void;
  onDelete?: (itemId: string) => void;
  onRecalculate?: () => void;
  onValidate?: () => void;
  onExport?: () => void;
  isLoading?: boolean;
  isExporting?: boolean;
}

const typeColors = {
  nic: 'bg-purple-500/10 text-purple-400',
  dpu: 'bg-emerald-500/10 text-emerald-400',
  switch: 'bg-blue-500/10 text-blue-400',
  transceiver: 'bg-green-500/10 text-green-400',
  cable: 'bg-yellow-500/10 text-yellow-400'
};

const typeLabels = {
  nic: '网卡',
  dpu: 'DPU',
  switch: '交换机',
  transceiver: '光模块',
  cable: '线缆'
};

export default function EditableBOMTable({ 
  items, 
  onEdit, 
  onAdd, 
  onDelete, 
  onRecalculate,
  onValidate,
  onExport,
  isLoading = false,
  isExporting = false
}: EditableBOMTableProps) {
  const renderItemDetails = (item: BOMItem) => {
    switch (item.type) {
      case 'nic':
        return (
          <div className="text-sm text-gray-400">
            {item.portCount}x{item.portType}, {item.speed}
          </div>
        );
      case 'switch':
        return (
          <div className="text-sm text-gray-400">
            {item.portCount}x{item.portType}, {item.speed}
          </div>
        );
      case 'transceiver':
        return (
          <div className="text-sm text-gray-400">
            {item.speed}, {item.portType}, {item.distance}
          </div>
        );
      case 'cable':
        return (
          <div className="text-sm text-gray-400">
            {item.cableType}, {item.length}, {item.interfaceType}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-[#76B900]" />
            <CardTitle>设备配置清单</CardTitle>
          </div>
          <CardDescription>完整的BOM清单，支持手动编辑</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdd?.('nic')}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加网卡
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdd?.('switch')}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加交换机
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdd?.('dpu')}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加DPU
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdd?.('transceiver')}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加光模块
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAdd?.('cable')}
          >
            <Plus className="h-4 w-4 mr-2" />
            添加线缆
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRecalculate}
            isLoading={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重新计算
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onValidate}
          >
            AI校验
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            isLoading={isExporting}
          >
            <Download className="h-4 w-4 mr-2" />
            导出Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 pl-4 font-medium text-gray-400">类型</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">名称</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">完整型号</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">规格</th>
                <th className="pb-3 pl-4 font-medium text-gray-400 text-right">数量</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">链接</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/30">
                  <td className="py-4 pl-4">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      typeColors[item.type]
                    )}>
                      {typeLabels[item.type]}
                    </span>
                  </td>
                  <td className="py-4 pl-4 font-medium text-gray-200">{item.name}</td>
                  <td className="py-4 pl-4 text-gray-300 font-mono text-sm">{item.fullModel}</td>
                  <td className="py-4 pl-4">
                    {renderItemDetails(item)}
                  </td>
                  <td className="py-4 pl-4 text-right font-bold text-white">{item.quantity}</td>
                  <td className="py-4 pl-4">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#76B900] hover:underline text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>
                      查看
                    </a>
                  </td>
                  <td className="py-4 pl-4">
                    <div className="flex items-center gap-2">
                      {item.isEditable && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => onEdit?.(item)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-red-400 border-red-900 hover:bg-red-900/20"
                            onClick={() => onDelete?.(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
