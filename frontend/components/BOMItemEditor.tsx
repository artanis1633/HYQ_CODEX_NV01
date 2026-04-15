'use client';

import { useEffect, useMemo, useState } from 'react';
import { BOMItem } from '@/lib/types';
import { PRODUCT_CATALOG, ProductCatalogEntry, createBOMItemFromCatalog } from '@/lib/productCatalog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

interface BOMItemEditorProps {
  mode: 'add' | 'edit';
  type: BOMItem['type'];
  initialItem?: BOMItem | null;
  onClose: () => void;
  onSave: (item: BOMItem) => void;
}

function getCatalogWithCurrent(type: BOMItem['type'], initialItem?: BOMItem | null): ProductCatalogEntry[] {
  const entries = PRODUCT_CATALOG[type] ?? [];
  if (!initialItem) {
    return entries;
  }

  const exists = entries.some((entry) => entry.fullModel === initialItem.fullModel);
  if (exists) {
    return entries;
  }

  return [
    {
      type: initialItem.type,
      name: initialItem.name,
      fullModel: initialItem.fullModel,
      link: initialItem.link,
      portCount: initialItem.portCount,
      portType: initialItem.portType,
      speed: initialItem.speed,
      distance: initialItem.distance,
      cableType: initialItem.cableType,
      length: initialItem.length,
      interfaceType: initialItem.interfaceType
    },
    ...entries
  ];
}

export default function BOMItemEditor({ mode, type, initialItem, onClose, onSave }: BOMItemEditorProps) {
  const catalog = useMemo(() => getCatalogWithCurrent(type, initialItem), [type, initialItem]);
  const [selectedModel, setSelectedModel] = useState(initialItem?.fullModel ?? catalog[0]?.fullModel ?? '');
  const [quantity, setQuantity] = useState(initialItem?.quantity ?? 1);

  useEffect(() => {
    setSelectedModel(initialItem?.fullModel ?? catalog[0]?.fullModel ?? '');
    setQuantity(initialItem?.quantity ?? 1);
  }, [catalog, initialItem]);

  const selectedEntry = catalog.find((entry) => entry.fullModel === selectedModel) ?? catalog[0];

  if (!selectedEntry) {
    return null;
  }

  const previewItem = createBOMItemFromCatalog(
    selectedEntry,
    quantity,
    initialItem?.id ?? `manual-${type}-${Date.now()}`
  );
  const mergedItem: BOMItem = initialItem
    ? {
        ...previewItem,
        id: initialItem.id,
        quantity
      }
    : previewItem;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <Card className="w-full max-w-2xl border-gray-700 bg-gray-950/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-xl">{mode === 'add' ? '添加设备' : '编辑设备'}</CardTitle>
          <CardDescription>
            从当前产品清单中选择设备并加入配置清单。后续你可以继续删除、替换或混编。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">产品型号</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              >
                {catalog.map((entry) => (
                  <option key={entry.fullModel} value={entry.fullModel}>
                    {entry.fullModel}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">数量</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-nvidia-green"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-800 bg-gray-900/70 p-4">
            <div className="mb-3 text-sm font-medium text-gray-200">预览</div>
            <div className="grid gap-2 text-sm text-gray-300 md:grid-cols-2">
              <div>名称：{mergedItem.name}</div>
              <div>型号：{mergedItem.fullModel}</div>
              <div>数量：{mergedItem.quantity}</div>
              {mergedItem.speed ? <div>速率：{mergedItem.speed}</div> : null}
              {mergedItem.portType ? <div>端口：{mergedItem.portType}</div> : null}
              {mergedItem.portCount ? <div>端口数：{mergedItem.portCount}</div> : null}
              {mergedItem.cableType ? <div>线缆类型：{mergedItem.cableType}</div> : null}
              {mergedItem.length ? <div>长度：{mergedItem.length}</div> : null}
              {mergedItem.distance ? <div>传输距离：{mergedItem.distance}</div> : null}
              {mergedItem.interfaceType ? <div>接口：{mergedItem.interfaceType}</div> : null}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              取消
            </Button>
            <Button onClick={() => onSave(mergedItem)}>
              {mode === 'add' ? '添加到清单' : '保存修改'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
