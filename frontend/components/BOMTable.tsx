import { BOMItem } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { ListTodo, Download, ExternalLink } from 'lucide-react';

interface BOMTableProps {
  items: BOMItem[];
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

export default function BOMTable({ items }: BOMTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="h-6 w-6 text-nvidia-green" />
            <CardTitle>设备配置清单</CardTitle>
          </div>
          <CardDescription>完整的BOM清单，包含官网链接</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          导出Excel
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="pb-3 pl-4 font-medium text-gray-400">设备类型</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">名称</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">型号</th>
                <th className="pb-3 pl-4 font-medium text-gray-400 text-right">数量</th>
                <th className="pb-3 pl-4 font-medium text-gray-400">链接</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-800/30">
                  <td className="py-4 pl-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[item.type]}`}>
                      {typeLabels[item.type]}
                    </span>
                  </td>
                  <td className="py-4 pl-4 font-medium text-gray-200">{item.name}</td>
                  <td className="py-4 pl-4 text-gray-400">{item.fullModel}</td>
                  <td className="py-4 pl-4 text-right font-bold text-white">{item.quantity}</td>
                  <td className="py-4 pl-4">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-nvidia-green hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      查看
                    </a>
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
