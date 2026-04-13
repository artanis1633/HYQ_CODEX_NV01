'use client';

import Link from 'next/link';
import { Home, Settings, List, Cpu } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-nvidia-dark/95 backdrop-blur supports-[backdrop-filter]:bg-nvidia-dark/80">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-nvidia-green rounded flex items-center justify-center">
            <Cpu className="h-5 w-5 text-black" />
          </div>
          <Link href="/" className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            NVIDIA <span className="text-nvidia-green">智算配置</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-500 text-black">
              Beta
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-nvidia-green transition-colors flex items-center gap-1">
              <Home className="h-4 w-4" />
              配置
            </Link>
            <Link href="/history" className="text-sm font-medium text-gray-300 hover:text-nvidia-green transition-colors flex items-center gap-1">
              <List className="h-4 w-4" />
              历史
            </Link>
          </nav>
          <div className="text-xs text-gray-400">
            Creation by HYQ
          </div>
        </div>
      </div>
    </header>
  );
}
