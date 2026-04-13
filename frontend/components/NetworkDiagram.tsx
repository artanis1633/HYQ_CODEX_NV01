import { NetworkDesign } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Layers, Shield, Gauge, TrendingUp, ExternalLink } from 'lucide-react';

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
          </div>
          <div className="p-4 border border-gray-700 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-400" />
              <h4 className="font-semibold text-gray-200">扩展性建议</h4>
            </div>
            <p className="text-sm text-gray-400">{data.scalability}</p>
          </div>
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
