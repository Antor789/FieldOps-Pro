import { useState, useCallback } from 'react';
import { GeneratedReport } from '../types/reports';
import { downloadReportPDF } from '../utils/pdfExport';
import { exportReportToExcel, exportReportToCSV } from '../utils/excelExport';
import { useToast } from '../context/ToastContext';

export function useReportExport() {
  const { addToast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportPDF = useCallback(
    async (report: GeneratedReport) => {
      setIsExporting(true);
      try {
        await downloadReportPDF(report);
        addToast({
          title: 'PDF Exported',
          description: `Downloaded ${report.templateName} as vector PDF.`,
          type: 'success',
        });
      } catch (err) {
        console.error('PDF export failed', err);
        addToast({
          title: 'PDF Export Failed',
          description: 'Failed to generate PDF document.',
          type: 'error',
        });
      } finally {
        setIsExporting(false);
      }
    },
    [addToast]
  );

  const exportExcel = useCallback(
    (report: GeneratedReport) => {
      try {
        exportReportToExcel(report);
        addToast({
          title: 'Excel Workbook Exported',
          description: `Downloaded ${report.templateName} as Microsoft Excel (.xlsx).`,
          type: 'success',
        });
      } catch (err) {
        console.error('Excel export failed', err);
        addToast({
          title: 'Excel Export Failed',
          description: 'Failed to generate Excel workbook.',
          type: 'error',
        });
      }
    },
    [addToast]
  );

  const exportCSV = useCallback(
    (report: GeneratedReport) => {
      try {
        exportReportToCSV(report);
        addToast({
          title: 'CSV File Exported',
          description: `Downloaded ${report.templateName} data as CSV.`,
          type: 'success',
        });
      } catch (err) {
        console.error('CSV export failed', err);
        addToast({
          title: 'CSV Export Failed',
          description: 'Failed to generate CSV file.',
          type: 'error',
        });
      }
    },
    [addToast]
  );

  const sendByEmail = useCallback(
    async (report: GeneratedReport, recipientEmail: string) => {
      setIsExporting(true);
      // Simulate SMTP / SES dispatch
      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsExporting(false);
      addToast({
        title: 'Report Sent via Email',
        description: `Delivered PDF attachment to ${recipientEmail}`,
        type: 'success',
      });
    },
    [addToast]
  );

  return {
    isExporting,
    exportPDF,
    exportExcel,
    exportCSV,
    sendByEmail,
  };
}
