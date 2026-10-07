import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GeneratedReport } from '../types/reports';
import { formatBDT } from './formatters';

/**
 * FieldOps Pro - PDF Export Generator
 * Creates print-ready, high-resolution vector PDF reports with executive summary,
 * key performance metrics, data tables, and official Bangladesh NBR compliance branding.
 */
export async function exportReportToPDF(report: GeneratedReport): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // 1. BRANDING HEADER
  // Header background bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Emerald accent strip
  doc.setFillColor(16, 185, 129); // emerald-500
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  // Brand Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('FIELDOPS PRO', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('ENTERPRISE FIELD SERVICE MANAGEMENT — BANGLADESH', margin, 17);
  doc.text('House 45, Road 12, Gulshan 2, Dhaka 1212 | NBR BIN: 002938102-0101', margin, 22);

  // Report Date / Generated Badge on top right
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  const genDateStr = `Generated: ${new Date(report.generatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`;
  doc.text(genDateStr, pageWidth - margin, 12, { align: 'right' });
  doc.text(`Period: ${report.dateRange.start} to ${report.dateRange.end}`, pageWidth - margin, 17, { align: 'right' });
  doc.text(`Ref: ${report.id.toUpperCase()}`, pageWidth - margin, 22, { align: 'right' });

  // 2. REPORT TITLE & DESCRIPTION
  let currentY = 36;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(report.templateName.toUpperCase(), margin, currentY);

  currentY += 6;
  if (report.description) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    const descLines = doc.splitTextToSize(report.description, pageWidth - margin * 2);
    doc.text(descLines, margin, currentY);
    currentY += descLines.length * 4.5 + 2;
  }

  // 3. EXECUTIVE SUMMARY METRICS BOXES
  if (report.summary?.metrics && report.summary.metrics.length > 0) {
    const metrics = report.summary.metrics.slice(0, 4);
    const boxCount = metrics.length;
    const spacing = 3;
    const totalSpacing = spacing * (boxCount - 1);
    const boxWidth = (pageWidth - margin * 2 - totalSpacing) / boxCount;
    const boxHeight = 18;

    metrics.forEach((m, idx) => {
      const boxX = margin + idx * (boxWidth + spacing);

      // Card Background
      doc.setFillColor(248, 250, 252); // slate-50
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.roundedRect(boxX, currentY, boxWidth, boxHeight, 2, 2, 'FD');

      // Metric Label
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text(m.label.length > 22 ? m.label.substring(0, 20) + '...' : m.label, boxX + 3, currentY + 5.5);

      // Metric Value
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      let valStr = String(m.value);
      if (m.format === 'currency' && typeof m.value === 'number') {
        valStr = `BDT ${m.value.toLocaleString()}`;
      }
      doc.text(valStr, boxX + 3, currentY + 13.5);
    });

    currentY += boxHeight + 8;
  }

  // 4. NBR VAT COMPLIANCE SPECIAL SECTION
  if (report.vatSummary) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('NATIONAL BOARD OF REVENUE (NBR) VAT RECONCILIATION (MUSHAK 6.3)', margin, currentY);
    currentY += 4;

    const vatRows = [
      ['Total Taxable Sales Turnover (A)', `BDT ${report.vatSummary.totalTaxableSales.toLocaleString()}`],
      ['Standard VAT Rate', `${report.vatSummary.vatRate}%`],
      ['Output VAT Collected (B = A x 15%)', `BDT ${report.vatSummary.outputVAT.toLocaleString()}`],
      ['Input VAT Credit Rebatable (C)', `BDT ${report.vatSummary.inputVATCredit.toLocaleString()}`],
      ['Net VAT Payable to Govt Treasury (B - C)', `BDT ${report.vatSummary.netVATPayable.toLocaleString()}`],
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['STATUTORY HEAD', 'TAXABLE AMOUNT & REBATE (BDT)']],
      body: vatRows,
      theme: 'striped',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 8.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [30, 41, 59],
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 'auto', halign: 'right', fontStyle: 'bold' },
      },
      margin: { left: margin, right: margin },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // 5. PRIMARY DETAILED DATA TABLE
  if (report.columns && report.data && report.data.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('DETAILED OPERATIONAL LEDGER', margin, currentY);
    currentY += 3;

    // Filter visible columns
    const activeColumns = report.columns.filter((c) => c.visible !== false).slice(0, 7);
    const headers = activeColumns.map((c) => c.header.toUpperCase());

    const rows = report.data.slice(0, 35).map((row) => {
      return activeColumns.map((c) => {
        const val = row[c.field];
        if (c.type === 'currency' && typeof val === 'number') {
          return `BDT ${val.toLocaleString()}`;
        }
        if (c.type === 'date' && val) {
          return String(val);
        }
        if (val === null || val === undefined) return '-';
        return String(val);
      });
    });

    autoTable(doc, {
      startY: currentY,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // slate-800
        textColor: [255, 255, 255],
        fontSize: 7.5,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 7,
        textColor: [51, 65, 85],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      margin: { left: margin, right: margin },
      didDrawPage: (data) => {
        // Page footer on every page
        const pageCount = (doc.internal as any).getNumberOfPages();
        const curPage = data.pageNumber;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Page ${curPage} of ${pageCount} | Confidential - FieldOps Pro Bangladesh | Tax BIN: 002938102-0101`,
          pageWidth / 2,
          pageHeight - 6,
          { align: 'center' }
        );
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // 6. TECHNICIAN SUMMARY (IF PRESENT AND ROOM ON PAGE)
  if (report.technicianBreakdown && report.technicianBreakdown.length > 0) {
    if (currentY + 45 > pageHeight) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('FIELD TECHNICIAN WORKFORCE SUMMARY', margin, currentY);
    currentY += 3;

    const techRows = report.technicianBreakdown.map((t) => [
      t.name,
      String(t.jobs),
      String(t.completed),
      `BDT ${t.revenue.toLocaleString()}`,
      `${t.rating} / 5.0`,
      `${t.slaPercent}%`,
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['TECHNICIAN', 'ASSIGNED', 'COMPLETED', 'REVENUE (BDT)', 'RATING', 'SLA %']],
      body: techRows,
      theme: 'striped',
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontSize: 7.5,
      },
      bodyStyles: {
        fontSize: 7,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
        3: { halign: 'right' },
        4: { halign: 'center' },
        5: { halign: 'right' },
      },
      margin: { left: margin, right: margin },
    });
  }

  // Output as Blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}

/**
 * Triggers direct browser download of generated PDF
 */
export async function downloadReportPDF(report: GeneratedReport): Promise<void> {
  const blob = await exportReportToPDF(report);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const fileName = `${report.templateName.replace(/[^a-zA-Z0-9]/g, '_')}_${report.dateRange.start}_to_${report.dateRange.end}.pdf`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
