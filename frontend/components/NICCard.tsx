import { NICRecommendation } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Network, ExternalLink, ServerCog } from 'lucide-react';

interface NICCardProps {
  data: NICRecommendation;
}

export default function NICCard({ data }: NICCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-6 w-6 text-[#76B900]" />
          <CardTitle>网卡推荐方案</CardTitle>
        </div>
        <CardDescription>基于您的GPU配置，推荐以下网卡配置</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">完整型号</p>
            <p className="text-lg font-bold text-[#76B900] font-mono">{data.fullModel}</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">端口配置</p>
            <p className="text-lg font-bold text-white">
              {data.portCount}x{data.portType} @ {data.speed}
            </p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">每台数量</p>
            <p className="text-2xl font-bold text-white">{data.countPerServer} 张</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-400 mb-1">组网路线</p>
            <p className="text-lg font-bold text-white">{data.fabricType}</p>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">技术解释</h4>
          <p className="text-gray-400 leading-relaxed">{data.explanation}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <ServerCog className="h-4 w-4 text-[#76B900]" />
            <h4 className="text-sm font-semibold text-gray-300">单台服务器网卡预览</h4>
          </div>
          <div className="space-y-3">
            {data.perServerAdapters.map((adapter) => (
              <div key={adapter.id} className="rounded-lg border border-gray-700 bg-gray-800/40 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-400">{adapter.deviceType === 'dpu' ? 'DPU' : 'NIC'} / {adapter.role}</p>
                    <p className="font-mono text-sm text-white">{adapter.fullModel}</p>
                  </div>
                  <div className="text-sm text-gray-300">
                    {adapter.quantity} 张 · {adapter.speed} · {adapter.portType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">规划说明</h4>
          <ul className="space-y-2">
            {data.planningNotes.map((note, idx) => (
              <li key={idx} className="text-sm text-gray-400">
                {note}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">NVIDIA 官方文档</h4>
          <ul className="space-y-2">
            {data.officialLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#76B900] hover:underline text-sm"
                >
                  <ExternalLink className="h-4 w-4" />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
