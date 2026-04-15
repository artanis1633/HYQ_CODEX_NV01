import { NetworkDesign } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Layers, Shield, Gauge, TrendingUp, ExternalLink, Cpu, Route, BrainCircuit } from 'lucide-react';

interface NetworkDiagramProps {
  data: NetworkDesign;
}

export default function NetworkDiagram({ data }: NetworkDiagramProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-nvidia-green" />
          <CardTitle>智算组网方案</CardTitle>
        </div>
        <CardDescription>完整的集群网络架构设计</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Cpu className="h-5 w-5 text-emerald-400" />
              <h4 className="font-semibold text-gray-200">GPU 输入摘要</h4>
            </div>
            <p className="text-sm text-gray-400">{data.gpuContextSummary}</p>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-5 w-5 text-cyan-400" />
              <h4 className="font-semibold text-gray-200">技术路线</h4>
            </div>
            <p className="text-sm text-gray-400">{data.fabricType} / {data.switchType}</p>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="h-5 w-5 text-orange-400" />
              <h4 className="font-semibold text-gray-200">带宽级别判断</h4>
            </div>
            <p className="text-sm text-gray-400">
              {data.bandwidthTier} / {data.analysisSource === 'ai' ? 'AI分析' : '规则分析'}
            </p>
            <p className="mt-2 text-sm text-gray-500">{data.bandwidthAnalysisSummary}</p>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="h-5 w-5 text-blue-400" />
              <h4 className="font-semibold text-gray-200">组网架构</h4>
            </div>
            <p className="text-sm text-gray-400">{data.architecture}</p>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-green-400" />
              <h4 className="font-semibold text-gray-200">高可用设计</h4>
            </div>
            <p className="text-sm text-gray-400">{data.highAvailability}</p>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <Gauge className="h-5 w-5 text-yellow-400" />
              <h4 className="font-semibold text-gray-200">性能预估</h4>
            </div>
            <p className="text-sm text-gray-400">{data.performanceEstimate}</p>
            <p className="mt-2 text-sm text-gray-500">单机对外网络理论带宽：{data.singleServerNetworkBandwidth}</p>
          </div>
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h4 className="font-semibold text-gray-200">扩展性建议</h4>
            </div>
            <p className="text-sm text-gray-400">{data.scalability}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Route className="h-5 w-5 text-nvidia-green" />
            <h4 className="font-semibold text-gray-200">网卡数量依据</h4>
          </div>
          <ul className="space-y-2">
            {data.nicSizingRationale.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-400">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-3">链路规划提示</h4>
          <ul className="space-y-2">
            {data.cablingGuidance.map((item, idx) => (
              <li key={idx} className="text-sm text-gray-400">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2">参考架构文档</h4>
          <ul className="space-y-2">
            {data.referenceLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-nvidia-green hover:underline text-sm"
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
