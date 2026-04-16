'use client';

import { CheckCircle2, Circle, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card';

interface LoadingPipelineProps {
  steps: string[];
  currentStep: number;
  title: string;
  description: string;
  notice?: string | null;
}

export default function LoadingPipeline({
  steps,
  currentStep,
  title,
  description,
  notice
}: LoadingPipelineProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
          <div
            className="h-full rounded-full bg-nvidia-green transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div
                key={step}
                className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  isCurrent
                    ? 'border-nvidia-green/60 bg-nvidia-green/5'
                    : isCompleted
                      ? 'border-gray-700 bg-gray-900/60'
                      : 'border-gray-800 bg-gray-950/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-nvidia-green" />
                  ) : isCurrent ? (
                    <Loader2 className="h-5 w-5 animate-spin text-nvidia-green" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                    {step}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {isCompleted
                      ? '已完成'
                      : isCurrent
                        ? '进行中'
                        : '等待执行'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {notice ? (
          <div className="flex items-start gap-3 rounded-xl border border-amber-700/40 bg-amber-500/10 px-4 py-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <p className="text-sm text-amber-200">{notice}</p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
