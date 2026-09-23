'use client';

import React from 'react';
import ArticleEditor from '@/components/publishing/ArticleEditor';
import NewsHeader from '@/components/portal/NewsHeader';

export default function SubmitArticlePage() {
  return (
    <div className="min-h-screen bg-[#07130E] text-neutral-100 pb-16">
      <NewsHeader />
      <div className="pt-6">
        <ArticleEditor />
      </div>
    </div>
  );
}
