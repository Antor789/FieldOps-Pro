import { BLUEPRINT_SECTIONS, SYSTEM_METRICS } from '../data/blueprintData';

export function downloadFullBlueprintMarkdown() {
  let md = `# FieldOps Pro - Enterprise System Architecture & Technical Specifications\n\n`;
  md += `**Target Scale:** 100,000+ Active Technicians | 5,000,000+ Monthly Work Orders | Sub-second Telemetry Streaming | 99.99% Uptime SLA\n\n`;
  md += `**Generated Date:** ${new Date().toISOString()}\n\n`;
  md += `---\n\n`;

  BLUEPRINT_SECTIONS.forEach((section) => {
    md += `## ${section.title}\n\n`;
    md += `*${section.subtitle}*\n\n`;
    md += `${section.description}\n\n`;

    if (section.keyMetrics) {
      md += `### Key Performance Targets\n`;
      section.keyMetrics.forEach((m) => {
        md += `- **${m.label}:** ${m.value} (${m.detail})\n`;
      });
      md += `\n`;
    }

    if (section.mermaidDiagram) {
      md += `### System Topology Diagram\n\n\`\`\`mermaid\n${section.mermaidDiagram}\n\`\`\`\n\n`;
    }

    if (section.decisionMatrix) {
      md += `### Architecture Decision Matrix\n\n`;
      md += `| Factor | Option A | Option B | Option C | Production Recommendation |\n`;
      md += `| --- | --- | --- | --- | --- |\n`;
      section.decisionMatrix.forEach((d) => {
        md += `| **${d.factor}** | ${d.optionA} | ${d.optionB} | ${d.optionC} | ${d.recommendation} |\n`;
      });
      md += `\n`;
    }

    if (section.codeSnippets) {
      md += `### Code & Configuration Specs\n\n`;
      section.codeSnippets.forEach((s) => {
        md += `#### ${s.title}\n`;
        md += `${s.explanation}\n\n`;
        md += `\`\`\`${s.language}\n${s.code}\n\`\`\`\n\n`;
      });
    }

    md += `---\n\n`;
  });

  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'FieldOps_Pro_Architecture_Blueprint.md');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
