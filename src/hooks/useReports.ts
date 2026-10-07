import { useState, useCallback, useMemo } from 'react';
import { ReportTemplate, GeneratedReport, ReportCategory } from '../types/reports';
import { REPORT_TEMPLATES } from '../data/reportTemplates';
import { generateReportFromTemplate } from '../utils/reportGenerator';
import { useToast } from '../context/ToastContext';

export function useReports() {
  const { addToast } = useToast();
  const [templates, setTemplates] = useState<ReportTemplate[]>(REPORT_TEMPLATES);
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReport, setActiveReport] = useState<GeneratedReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filtered templates list
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (tpl.nameBangla && tpl.nameBangla.includes(searchQuery)) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  // Grouped templates by category
  const templatesByCategory = useMemo(() => {
    const groups: Record<ReportCategory, ReportTemplate[]> = {
      operations: [],
      financial: [],
      technician: [],
      customer: [],
      inventory: [],
      compliance: [],
    };

    filteredTemplates.forEach((t) => {
      if (groups[t.category]) {
        groups[t.category].push(t);
      }
    });

    return groups;
  }, [filteredTemplates]);

  // Generate report
  const generateReport = useCallback(
    (templateId: string, customFilters?: Record<string, any>) => {
      const template = templates.find((t) => t.id === templateId);
      if (!template) {
        addToast({
          title: 'Template Not Found',
          description: `Could not find template with id: ${templateId}`,
          type: 'error',
        });
        return null;
      }

      setIsGenerating(true);
      try {
        const generated = generateReportFromTemplate(template, customFilters);
        setActiveReport(generated);
        addToast({
          title: 'Report Generated',
          description: `${template.name} generated successfully.`,
          type: 'success',
        });
        return generated;
      } catch (err) {
        console.error('Error generating report:', err);
        addToast({
          title: 'Generation Failed',
          description: 'An unexpected error occurred while compiling report data.',
          type: 'error',
        });
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [templates, addToast]
  );

  // Save custom template
  const saveTemplate = useCallback(
    (newTemplate: ReportTemplate) => {
      setTemplates((prev) => [newTemplate, ...prev]);
      addToast({
        title: 'Template Saved',
        description: `Custom template "${newTemplate.name}" was added to your library.`,
        type: 'success',
      });
    },
    [addToast]
  );

  // Delete custom template
  const deleteTemplate = useCallback(
    (templateId: string) => {
      setTemplates((prev) => prev.filter((t) => t.id !== templateId));
      addToast({
        title: 'Template Deleted',
        description: 'Custom report template was removed.',
        type: 'info',
      });
    },
    [addToast]
  );

  return {
    templates,
    filteredTemplates,
    templatesByCategory,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    activeReport,
    setActiveReport,
    isGenerating,
    generateReport,
    saveTemplate,
    deleteTemplate,
  };
}
