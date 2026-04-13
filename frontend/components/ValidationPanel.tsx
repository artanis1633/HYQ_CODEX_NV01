import { ValidationReport } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { ShieldCheck, AlertCircle, AlertTriangle, Info, FileText, BookOpen, CheckCircle2 } from 'lucide-react';

interface ValidationPanelProps {
  report?: ValidationReport;
  isLoading?: boolean;
}

const severityColors = {
  error: 'text-red-400 bg-red-500/10 border-red-900',
  warning: 'text-yellow-400 bg-yellow-500/10 border-yellow-900',
  info: 'text-blue-400 bg-blue-500/10 border-blue-900'
};

const severityIcons = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
};

export default function ValidationPanel({ report, isLoading = false }: ValidationPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#76B900]" />
            <CardTitle>AI 配置校验</CardTitle>
          </div>
          <CardDescription>多智能体验证配置合理性中...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#76B900]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-[#76B900]" />
            <CardTitle>AI 配置校验</CardTitle>
          </div>
          <CardDescription>点击"AI校验"按钮开始验证配置</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-400';
    if (score >= 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#76B900]" />
              <CardTitle>AI 配置校验报告</CardTitle>
            </div>
            <CardDescription>由多智能体联合验证</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">
              <span className={getScoreColor(report.overallScore)}>
                {report.overallScore.toFixed(1)}
              </span>
              <span className="text-gray-500 text-xl">/10</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {report.issues.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">问题列表</h4>
            <div className="space-y-3">
              {report.issues.map((issue, idx) => {
                const Icon = severityIcons[issue.severity];
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg border ${severityColors[issue.severity]}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{issue.message}</p>
                        {issue.suggestion && (
                          <p className="text-sm mt-1 opacity-80">
                            <span className="font-medium">建议：</span>
                            {issue.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {report.configurationBasis.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              配置依据
            </h4>
            <ul className="space-y-2">
              {report.configurationBasis.map((basis, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-400">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#76B900] mt-0.5" />
                  <span>{basis}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {report.referenceDocs.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              参考文档
            </h4>
            <ul className="space-y-2">
              {report.referenceDocs.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#76B900] hover:underline text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" x2="3" y1="12" y2="12"></line></svg>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
