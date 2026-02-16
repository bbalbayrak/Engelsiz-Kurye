'use client';

import { useState } from 'react';

interface AccordionItem {
  question: string;
  answer: string;
}

export default function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`border rounded-xl transition-colors duration-200 ${
              isOpen ? 'border-amber-500/30 bg-amber-500/[0.03]' : 'border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left"
            >
              <span className={`text-sm md:text-[15px] font-medium transition-colors ${isOpen ? 'text-amber-500' : 'text-zinc-200'}`}>
                {item.question}
              </span>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                isOpen ? 'bg-amber-500/20 rotate-180' : 'bg-zinc-800'
              }`}>
                <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
            <div
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{ maxHeight: isOpen ? 500 : 0, opacity: isOpen ? 1 : 0 }}
            >
              <div className="px-4 pb-4 md:px-5 md:pb-5 text-zinc-400 text-sm leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
