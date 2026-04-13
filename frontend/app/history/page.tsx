import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Clock } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-6 w-6 text-nvidia-green" />
              <h1 className="text-3xl font-bold">配置历史</h1>
            </div>
            <p className="text-gray-400">查看之前生成的配置方案</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>暂无历史记录</CardTitle>
              <CardDescription>完成配置后，历史记录将显示在这里</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
