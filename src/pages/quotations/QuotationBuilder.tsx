import React, { useState } from 'react';
import { Quotation, QuotationSection } from '../../types/quotations';
import { LineItemEditor } from '../../components/quotations/LineItemEditor';
import { QuotationSummary } from '../../components/quotations/QuotationSummary';
import { QuotationPDF } from './QuotationPDF';
import {
  FileText,
  ArrowLeft,
  Building2,
  Calendar,
  Send,
  Save,
  Eye,
  CheckCircle2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';

interface QuotationBuilderProps {
  initialQuotation?: Partial<Quotation>;
  onSave: (quote: Quotation, action: 'save_draft' | 'send' | 'convert') => void;
  onCancel: () => void;
}

const PRESET_CUSTOMERS = [
  {
    id: 'cust-gp-hq',
    name: 'Grameenphone Telecom Ltd',
    nameBn: 'গ্রামীণফোন লিমিটেড',
    email: 'noc.procurement@grameenphone.com',
    phone: '+880 1712-345678',
    address: 'GP House, Bashundhara R/A, Dhaka-1229',
    bin: '002938102-0101',
  },
  {
    id: 'cust-desco-hq',
    name: 'Dhaka Electric Supply Company (DESCO)',
    nameBn: 'ডেসকো মিরপুর সার্কেল',
    email: 'maintenance.mirpur@desco.org.bd',
    phone: '+880 1819-234567',
    address: 'DESCO Bhaban, Kallyanpur, Dhaka-1207',
    bin: '001188291-0102',
  },
  {
    id: 'cust-walton-corp',
    name: 'Walton Hi-Tech Industries PLC',
    nameBn: 'ওয়ালটন হাই-টেক ইন্ডাস্ট্রিজ পিএলসি',
    email: 'procurement.hvac@waltonbd.com',
    phone: '+880 1987-112233',
    address: 'Plot 1088, Chandra, Gazipur-1751',
    bin: '001928374-0101',
  },
  {
    id: 'cust-apex-gazipur',
    name: 'Apex Footwear Ltd',
    nameBn: 'অ্যাপেক্স ফুটওয়্যার লিমিটেড',
    email: 'factory.maintenance@apexfootwearltd.com',
    phone: '+880 1913-889900',
    address: 'Shafipur, Kaliakoir, Gazipur-1750',
    bin: '003889104-0201',
  },
  {
    id: 'cust-beximco-pharma',
    name: 'Beximco Pharmaceuticals Ltd',
    nameBn: 'বেক্সিমকো ফার্মাসিউটিক্যালস লিমিটেড',
    email: 'sterile.engineering@beximco-pharma.com',
    phone: '+880 1711-556677',
    address: 'Tongi Industrial Area, Gazipur-1711',
    bin: '001928374-0301',
  },
  {
    id: 'cust-square-hosp',
    name: 'Square Hospitals Ltd',
    nameBn: 'স্কয়ার হসপিটালস লিমিটেড',
    email: 'biomedical.dept@squarehospital.com',
    phone: '+880 1713-001122',
    address: '18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka',
    bin: '002819023-0101',
  },
];

export const QuotationBuilder: React.FC<QuotationBuilderProps> = ({
  initialQuotation,
  onSave,
  onCancel,
}) => {
  const { addToast } = useToast();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    initialQuotation?.customerId || PRESET_CUSTOMERS[0].id
  );
  const [customerName, setCustomerName] = useState(
    initialQuotation?.customerName || PRESET_CUSTOMERS[0].name
  );
  const [customerNameBn, setCustomerNameBn] = useState(
    initialQuotation?.customerNameBn || PRESET_CUSTOMERS[0].nameBn
  );
  const [customerEmail, setCustomerEmail] = useState(
    initialQuotation?.customerEmail || PRESET_CUSTOMERS[0].email
  );
  const [customerPhone, setCustomerPhone] = useState(
    initialQuotation?.customerPhone || PRESET_CUSTOMERS[0].phone
  );
  const [customerAddress, setCustomerAddress] = useState(
    initialQuotation?.customerAddress || PRESET_CUSTOMERS[0].address
  );
  const [customerBin, setCustomerBin] = useState(
    initialQuotation?.customerBin || PRESET_CUSTOMERS[0].bin
  );

  const [quotationNumber] = useState(
    initialQuotation?.quotationNumber || `QT-2025-${Math.floor(100 + Math.random() * 900)}`
  );
  const [date, setDate] = useState<string>(
    initialQuotation?.date ? String(initialQuotation.date).slice(0, 10) : new Date().toISOString().slice(0, 10)
  );
  const [validUntil, setValidUntil] = useState<string>(
    initialQuotation?.validUntil
      ? String(initialQuotation.validUntil).slice(0, 10)
      : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
  );

  // Sections with initial line items
  const [sections, setSections] = useState<QuotationSection[]>(
    initialQuotation?.sections || [
      {
        id: 'sec-1',
        title: 'Diagnostic & Mechanical Servicing',
        items: [
          {
            id: 'li-1',
            description: 'AC Servicing (1.5 - 2.5 Ton Cassette / Split)',
            quantity: 2,
            unit: 'Unit',
            unitPrice: 3500,
            total: 7000,
            category: 'HVAC',
          },
          {
            id: 'li-2',
            description: 'Refrigerant Refill (DuPont R410A)',
            quantity: 2,
            unit: 'Kg',
            unitPrice: 2200,
            total: 4400,
            category: 'HVAC',
          },
          {
            id: 'li-3',
            description: 'Senior Field Service Engineer Labor Charges',
            quantity: 4,
            unit: 'Hours',
            unitPrice: 1000,
            total: 4000,
            category: 'Labor',
          },
          {
            id: 'li-4',
            description: 'Service Van Tooling & Transport Logistics',
            quantity: 1,
            unit: 'Lumpsum',
            unitPrice: 1500,
            total: 1500,
            category: 'Consumables',
          },
        ],
      },
    ]
  );

  // Financial discount & VAT state
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(
    initialQuotation?.discountType || 'percentage'
  );
  const [discountValue, setDiscountValue] = useState<number>(
    initialQuotation?.discountValue ?? 5
  );
  const [includeVat, setIncludeVat] = useState<boolean>(
    initialQuotation?.includeVat ?? true
  );

  const [notes, setNotes] = useState<string>(
    initialQuotation?.notes || 'Comprehensive preventive maintenance & electrical calibration estimate.'
  );
  const [terms, setTerms] = useState<string>(
    initialQuotation?.terms ||
      '1. Payment: 50% advance with work order, 50% upon job completion.\n2. Official NBR 15% VAT Mushak-6.3 challan will be supplied.\n3. Workmanship guaranteed for 60 calendar days.'
  );

  const [isPreviewPdfOpen, setIsPreviewPdfOpen] = useState(false);

  // Calculate live totals
  const subtotal = sections.reduce(
    (secSum, sec) => secSum + sec.items.reduce((itemSum, item) => itemSum + (item.total || 0), 0),
    0
  );

  const discountAmount =
    discountType === 'percentage'
      ? Math.round((subtotal * Math.min(100, Math.max(0, discountValue))) / 100)
      : Math.min(subtotal, Math.max(0, discountValue));

  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const vatAmount = includeVat ? Math.round(afterDiscount * 0.15) : 0;
  const total = afterDiscount + vatAmount;

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const found = PRESET_CUSTOMERS.find((c) => c.id === customerId);
    if (found) {
      setCustomerName(found.name);
      setCustomerNameBn(found.nameBn);
      setCustomerEmail(found.email);
      setCustomerPhone(found.phone);
      setCustomerAddress(found.address);
      setCustomerBin(found.bin);
    }
  };

  const buildQuoteObject = (status: Quotation['status']): Quotation => {
    return {
      id: initialQuotation?.id || `qt-${Date.now()}`,
      quotationNumber,
      status,
      customerId: selectedCustomerId,
      customerName,
      customerNameBn,
      customerEmail,
      customerPhone,
      customerAddress,
      customerBin,
      date,
      validUntil,
      sections,
      subtotal,
      discountType,
      discountValue,
      discountAmount,
      includeVat,
      vatRate: 0.15,
      vatAmount,
      total,
      notes,
      terms,
      sentAt: status === 'sent' ? new Date().toISOString() : initialQuotation?.sentAt,
      createdBy: initialQuotation?.createdBy || 'Operations Engineer',
      createdAt: initialQuotation?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: initialQuotation?.comments || [],
    };
  };

  const handleSaveAction = (action: 'save_draft' | 'send' | 'convert') => {
    if (!customerName.trim()) {
      addToast({
        title: 'Missing Customer',
        description: 'Please specify or select a customer.',
        type: 'warning',
      });
      return;
    }

    if (sections.every((s) => s.items.length === 0)) {
      addToast({
        title: 'Empty Quotation',
        description: 'Please add at least one line item to the quotation.',
        type: 'warning',
      });
      return;
    }

    const status: Quotation['status'] = action === 'send' ? 'sent' : action === 'convert' ? 'approved' : 'draft';
    const finalQuote = buildQuoteObject(status);
    onSave(finalQuote, action);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Back */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              {initialQuotation?.id ? 'Edit Quotation' : 'Professional Quotation Builder (নতুন কোটেশন)'}
            </h1>
            <p className="text-xs text-slate-500">
              Reference #{quotationNumber} • Bangladesh BDT & 15% NBR VAT Calculation
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewPdfOpen(true)}
            className="text-xs flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-blue-500" />
            Preview PDF
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSaveAction('save_draft')}
            className="text-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSaveAction('send')}
            className="text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            Send to Customer
          </Button>
        </div>
      </div>

      {/* 2. Customer & Basic Metadata Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          Customer Particulars & Validity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          {/* Preset Customer Dropdown */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Select Client / Enterprise (গ্রাহক নির্বাচন) *
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleSelectCustomer(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            >
              {PRESET_CUSTOMERS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.nameBn})
                </option>
              ))}
            </select>
          </div>

          {/* Quotation Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quotation Ref #
            </label>
            <input
              type="text"
              value={quotationNumber}
              readOnly
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-blue-600 dark:text-blue-400"
            />
          </div>

          {/* NBR BIN */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer NBR BIN
            </label>
            <input
              type="text"
              value={customerBin}
              onChange={(e) => setCustomerBin(e.target.value)}
              placeholder="002938102-0101"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* Dates */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Issue Date (প্রদানের তারিখ) *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valid Until (মেয়াদকাল) *
            </label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer Phone
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Customer Email
            </label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 3. Line Items Editor with Multi-Section & Catalog Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Scope of Work & Line Items (কাজের পরিধি ও আইটেমসমূহ)</span>
          </h3>
          <span className="text-xs text-slate-500">
            Total Sections: {sections.length}
          </span>
        </div>

        <LineItemEditor sections={sections} onChange={setSections} />
      </div>

      {/* 4. Financial Summary & Commercial Terms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Terms & Conditions Textarea */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
            Commercial Terms & Customer Notes
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Quotation Subject / Overview Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Brief summary of service scope..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Statutory Terms & Conditions (শর্তাবলী)
              </label>
              <div className="flex gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={() =>
                    setTerms(
                      '1. Payment: 50% advance with work order, 50% upon job completion.\n2. Official NBR 15% VAT Mushak-6.3 challan will be supplied.\n3. Workmanship guaranteed for 60 calendar days.'
                    )
                  }
                  className="text-blue-600 hover:underline"
                >
                  Standard
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() =>
                    setTerms(
                      '1. Payment: 100% post-completion against 30-day corporate credit.\n2. Client provides power, water, and site clearance.\n3. Defective components returned to client.'
                    )
                  }
                  className="text-blue-600 hover:underline"
                >
                  Enterprise 30-Day
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Real-time Calculation Summary Box */}
        <QuotationSummary
          subtotal={subtotal}
          discountType={discountType}
          discountValue={discountValue}
          includeVat={includeVat}
          vatRate={0.15}
          onDiscountTypeChange={setDiscountType}
          onDiscountValueChange={setDiscountValue}
          onIncludeVatChange={setIncludeVat}
        />
      </div>

      {/* 5. Bottom Action Buttons Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsPreviewPdfOpen(true)}
          >
            <Eye className="w-3.5 h-3.5 mr-1" />
            Preview Document
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleSaveAction('save_draft')}
          >
            <Save className="w-3.5 h-3.5 mr-1" />
            Save as Draft
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSaveAction('send')}
            className="shadow-sm"
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            Send to Customer ({customerName})
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleSaveAction('convert')}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
          >
            <Zap className="w-3.5 h-3.5 mr-1" />
            Direct Approve & Convert to WO
          </Button>
        </div>
      </div>

      {/* PDF Modal Preview */}
      <QuotationPDF
        quotation={buildQuoteObject('draft')}
        isOpen={isPreviewPdfOpen}
        onClose={() => setIsPreviewPdfOpen(false)}
      />
    </div>
  );
};
