import React from 'react';
import { Contract } from '../../types/contracts';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Building2, Calendar, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatBDT } from '../../data/sampleContractsData';

interface ContractPDFModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ContractPDFModal: React.FC<ContractPDFModalProps> = ({
  contract,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !contract) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Service Agreement: {contract.contractNumber}
              </h3>
              <p className="text-xs text-slate-500">Government Non-Judicial Stamp & Legal Deed Format</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6 text-slate-800 dark:text-slate-200 font-serif leading-relaxed text-sm bg-white dark:bg-slate-900 print:p-0 print:text-black">
          {/* Header Banner - Bangladesh Stamp Duty Simulation */}
          <div className="border-b-2 border-slate-800 dark:border-slate-300 pb-4 text-center space-y-1">
            <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-slate-500">
              Government of the People&apos;s Republic of Bangladesh
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-sans tracking-wide text-slate-900 dark:text-white">
              SERVICE LEVEL AGREEMENT & ANNUAL MAINTENANCE CONTRACT
            </h1>
            <p className="text-xs font-sans text-slate-600 dark:text-slate-400">
              Executed under the Bangladesh Contract Act 1872 & Information and Communication Technology (ICT) Act 2006
            </p>
            <div className="inline-block mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
              DEED NO: {contract.contractNumber}
            </div>
          </div>

          {/* Parties Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 font-sans text-xs border border-slate-200 dark:border-slate-800">
            <div>
              <strong className="block text-slate-900 dark:text-white text-sm mb-1">
                FIRST PARTY (Service Provider):
              </strong>
              <p className="font-semibold text-blue-600 dark:text-blue-400">FieldOps Pro Engineering Ltd.</p>
              <p className="text-slate-600 dark:text-slate-400">Level 8, Concord Tower, 113 Gulshan Avenue</p>
              <p className="text-slate-600 dark:text-slate-400">Dhaka-1212, Bangladesh</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">NBR VAT BIN: 001998822-0101</p>
              <p className="text-slate-600 dark:text-slate-400">Contact: +880 2 988-1234 | ops@fieldops.bd</p>
            </div>

            <div>
              <strong className="block text-slate-900 dark:text-white text-sm mb-1">
                SECOND PARTY (Client / Enterprise):
              </strong>
              <p className="font-semibold text-slate-900 dark:text-white">{contract.customerName}</p>
              <p className="text-slate-600 dark:text-slate-400">{contract.customerAddress || 'Dhaka, Bangladesh'}</p>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                NBR VAT BIN: {contract.customerBin || '002938102-0101'}
              </p>
              <p className="text-slate-600 dark:text-slate-400">
                Contact: {contract.customerContactPerson} ({contract.customerPhone || 'N/A'})
              </p>
            </div>
          </div>

          {/* Clause 1: Subject Matter & Validity */}
          <div>
            <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              1. Title & Duration of Agreement
            </h4>
            <p>
              This Agreement shall govern <strong>{contract.title}</strong>{' '}
              {contract.titleBangla && `(${contract.titleBangla})`}. The duration of this Agreement shall commence from{' '}
              <strong>
                {new Date(contract.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>{' '}
              and remain valid through{' '}
              <strong>
                {new Date(contract.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </strong>
              , unless terminated prematurely in accordance with the terms herein.
            </p>
          </div>

          {/* Clause 2: Financial Considerations & Taxes */}
          <div>
            <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              2. Contract Value & Payment Terms
            </h4>
            <p>
              The Total Contract Consideration for the term is agreed at{' '}
              <strong>{formatBDT(contract.value)} (Bangladeshi Taka)</strong>. Payments shall be made on a{' '}
              <strong className="capitalize">{contract.paymentTerms}</strong> basis. The First Party shall furnish formal
              National Board of Revenue (NBR) <strong>Mushak-6.3 Tax Challan</strong> specifying 15% VAT and statutory
              Source Tax (AIT) deductions under Bangladesh Tax Code.
            </p>
          </div>

          {/* Clause 3: Scope of Work */}
          <div>
            <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              3. Scope of Services & Covered Facilities
            </h4>
            <ul className="list-disc list-inside space-y-1 font-sans text-xs text-slate-700 dark:text-slate-300">
              {contract.scopeOfWork.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            {contract.coveredLocations && contract.coveredLocations.length > 0 && (
              <div className="mt-3">
                <span className="font-sans font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Designated Sites:
                </span>
                <p className="font-sans text-xs text-slate-600 dark:text-slate-400">
                  {contract.coveredLocations.join('; ')}
                </p>
              </div>
            )}
          </div>

          {/* Clause 4: Service Level Commitments */}
          <div>
            <h4 className="font-sans font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider mb-2">
              4. Service Level Agreement (SLA) & Liquidated Damages
            </h4>
            <div className="overflow-x-auto font-sans text-xs">
              <table className="w-full border-collapse border border-slate-300 dark:border-slate-700 text-left">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 font-bold">
                    <th className="border border-slate-300 dark:border-slate-700 p-2">Severity</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2">Max Response</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2">Max Resolution</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2">Breach Penalty (BDT)</th>
                    <th className="border border-slate-300 dark:border-slate-700 p-2">Target Uptime</th>
                  </tr>
                </thead>
                <tbody>
                  {contract.slaTerms.map((term, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="border border-slate-300 dark:border-slate-700 p-2 uppercase font-semibold">
                        {term.priority}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2">
                        {term.responseTimeHours} hr{term.responseTimeHours !== 1 ? 's' : ''}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2">
                        {term.resolutionTimeHours} hrs
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2">
                        {term.penalty ? formatBDT(term.penalty) : 'None'}
                      </td>
                      <td className="border border-slate-300 dark:border-slate-700 p-2">
                        {term.uptimeGuaranteePercent ?? 99.0}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures & Execution Section */}
          <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800 font-sans">
            <p className="text-xs text-slate-500 mb-6 text-center italic">
              IN WITNESS WHEREOF, the authorized representatives of both Parties execute this Service Agreement on this day.
            </p>

            <div className="grid grid-cols-2 gap-8 pt-4">
              {/* First Party Signature */}
              <div className="space-y-2">
                <div className="h-16 flex items-end">
                  <div className="font-serif italic font-bold text-lg text-blue-900 dark:text-blue-300">
                    Engr. M. Rafiqul Islam
                  </div>
                </div>
                <div className="border-t border-slate-400 pt-1 text-xs">
                  <strong className="block text-slate-900 dark:text-white">Authorized Signature</strong>
                  <span>Managing Director, FieldOps Pro</span>
                  <span className="block text-[11px] text-slate-400">Date: {contract.createdAt ? String(contract.createdAt).slice(0, 10) : '2025-04-01'}</span>
                </div>
              </div>

              {/* Second Party Signature */}
              <div className="space-y-2">
                <div className="h-16 flex items-end">
                  {contract.signature ? (
                    <img
                      src={contract.signature}
                      alt="Customer Digital Signature"
                      className="max-h-14 object-contain"
                    />
                  ) : (
                    <div className="font-serif italic font-bold text-lg text-slate-800 dark:text-slate-300">
                      {contract.signedBy || 'Fahim Rahman'}
                    </div>
                  )}
                </div>
                <div className="border-t border-slate-400 pt-1 text-xs">
                  <strong className="block text-slate-900 dark:text-white">Customer Signature & Seal</strong>
                  <span>{contract.signedBy || contract.customerContactPerson || contract.customerName}</span>
                  <span className="block text-[11px] text-slate-400">
                    Digitally Verified: {contract.signedAt ? String(contract.signedAt).slice(0, 10) : 'Active'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 rounded-b-2xl">
          <span className="text-xs text-slate-500">
            Document Hash: SHA-256 Verified • Compliant with Bangladesh ICT Act 2006
          </span>
          <Button variant="primary" size="sm" onClick={onClose}>
            Done / Close Preview
          </Button>
        </div>
      </div>
    </div>
  );
};
