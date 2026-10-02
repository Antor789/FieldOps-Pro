import React from 'react';
import { ArchitectureSection } from '../types/architecture';
import { MermaidViewer } from './MermaidViewer';
import { CodeBlock } from './CodeBlock';
import { CheckCircle2, Sliders, FileText } from 'lucide-react';

interface SectionViewerProps {
  section: ArchitectureSection;
}

export const SectionViewer: React.FC<SectionViewerProps> = ({ section }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Title Header */}
      <div className="border-b border-slate-800 pb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{section.title}</h2>
        <p className="text-sm text-blue-400 font-mono mt-1 font-semibold">{section.subtitle}</p>
        <p className="text-sm text-slate-300 mt-3 leading-relaxed max-w-4xl">{section.description}</p>
      </div>

      {/* Key Metrics Strip */}
      {section.keyMetrics && section.keyMetrics.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          {section.keyMetrics.map((km, idx) => (
            <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">{km.label}</span>
              <p className="text-xl font-bold text-blue-400 mt-1">{km.value}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">{km.detail}</p>
            </div>
          ))}
        </div>
      )}

      {/* Mermaid Architecture Diagram */}
      {section.mermaidDiagram && (
        <div>
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2 font-mono">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Architecture & Sequence Flow Topology</span>
          </h3>
          <MermaidViewer chart={section.mermaidDiagram} id={section.id} />
        </div>
      )}

      {/* Decision Matrix Table */}
      {section.decisionMatrix && section.decisionMatrix.length > 0 && (
        <div className="my-6 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 font-mono">Architectural Trade-Off & Decision Matrix</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">Architectural Factor</th>
                  <th className="px-5 py-3 font-semibold">Option A</th>
                  <th className="px-5 py-3 font-semibold">Option B</th>
                  <th className="px-5 py-3 font-semibold">Option C</th>
                  <th className="px-5 py-3 font-semibold text-blue-400">Production Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {section.decisionMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/40 transition">
                    <td className="px-5 py-4 font-bold text-white">{row.factor}</td>
                    <td className="px-5 py-4 text-slate-400">{row.optionA}</td>
                    <td className="px-5 py-4 text-slate-400">{row.optionB}</td>
                    <td className="px-5 py-4 text-slate-400">{row.optionC}</td>
                    <td className="px-5 py-4 bg-blue-950/30 text-emerald-300 border-l border-slate-800">
                      <div className="flex items-start space-x-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{row.recommendation}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Code Snippets */}
      {section.codeSnippets && section.codeSnippets.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-slate-200 flex items-center space-x-2 font-mono">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Production Implementation Specifications & Code Snippets</span>
          </h3>
          {section.codeSnippets.map((snippet, idx) => (
            <CodeBlock key={idx} snippet={snippet} />
          ))}
        </div>
      )}
    </div>
  );
};
