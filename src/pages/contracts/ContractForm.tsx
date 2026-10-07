import React, { useState } from 'react';
import {
  Contract,
  ContractEquipmentItem,
  ContractPaymentTerms,
  ContractType,
  SLATerm,
} from '../../types/contracts';
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
  Building2,
  Calendar,
  CreditCard,
  Shield,
  Package,
  MapPin,
  Users,
  PenTool,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { SLATermsBuilder } from '../../components/contracts/SLATermsBuilder';
import { DigitalSignature } from '../../components/contracts/DigitalSignature';
import { DEFAULT_SLA_TERMS, formatBDT } from '../../data/sampleContractsData';

interface ContractFormProps {
  initialContract?: Partial<Contract>;
  onSave: (contractData: Contract) => void;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: 'Basic Info', desc: 'Customer & Dates' },
  { id: 2, title: 'SLA Terms', desc: 'Response Matrix' },
  { id: 3, title: 'Scope & Assets', desc: 'Locations & Equipment' },
  { id: 4, title: 'Billing & Techs', desc: 'Payments & Team' },
  { id: 5, title: 'Review & Sign', desc: 'Digital Signature' },
];

export const ContractForm: React.FC<ContractFormProps> = ({
  initialContract,
  onSave,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [contractNumber] = useState(
    initialContract?.contractNumber || `AMC-2026-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [title, setTitle] = useState(
    initialContract?.title || 'Data Center Precision Cooling & Generator AMC'
  );
  const [titleBangla, setTitleBangla] = useState(
    initialContract?.titleBangla || 'ডেটা সেন্টার প্রিসিশন কুলিং ও জেনারেটর এএমসি'
  );
  const [type, setType] = useState<ContractType>(initialContract?.type || 'amc');
  const [customerName, setCustomerName] = useState(
    initialContract?.customerName || 'Grameenphone Telecom Ltd'
  );
  const [customerId] = useState(initialContract?.customerId || 'cust-gp-hq');
  const [customerContactPerson, setCustomerContactPerson] = useState(
    initialContract?.customerContactPerson || 'Fahim Rahman'
  );
  const [customerPhone, setCustomerPhone] = useState(
    initialContract?.customerPhone || '+880 1712-345678'
  );
  const [customerEmail, setCustomerEmail] = useState(
    initialContract?.customerEmail || 'noc.procurement@grameenphone.com'
  );
  const [customerBin, setCustomerBin] = useState(
    initialContract?.customerBin || '002938102-0101'
  );
  const [customerAddress, setCustomerAddress] = useState(
    initialContract?.customerAddress || 'GP House, Bashundhara R/A, Dhaka-1229'
  );

  const [startDate, setStartDate] = useState(
    initialContract?.startDate ? String(initialContract.startDate).slice(0, 10) : '2026-03-01'
  );
  const [endDate, setEndDate] = useState(
    initialContract?.endDate ? String(initialContract.endDate).slice(0, 10) : '2027-02-28'
  );
  const [value, setValue] = useState<number>(initialContract?.value || 750000);
  const [paymentTerms, setPaymentTerms] = useState<ContractPaymentTerms>(
    initialContract?.paymentTerms || 'quarterly'
  );

  // Step 2: SLA
  const [slaTerms, setSlaTerms] = useState<SLATerm[]>(
    initialContract?.slaTerms || DEFAULT_SLA_TERMS
  );

  // Step 3: Scope & Equipment
  const [scopeOfWork, setScopeOfWork] = useState<string[]>(
    initialContract?.scopeOfWork || [
      '24/7 emergency breakdown support with guaranteed technician dispatch',
      'Monthly preventive maintenance checklist inspection and cleaning',
      'Quarterly lubrication, motor vibration analysis, and filter replacements',
      'Supply of common consumable spares without additional markup',
    ]
  );
  const [newScopeItem, setNewScopeItem] = useState('');

  const [coveredLocations, setCoveredLocations] = useState<string[]>(
    initialContract?.coveredLocations || [
      'GP House - Tier 3 Datacenter, Bashundhara R/A, Dhaka',
      'Gulshan 2 Switch Station, Road 113, Dhaka',
    ]
  );
  const [newLocation, setNewLocation] = useState('');

  const [coveredEquipment, setCoveredEquipment] = useState<ContractEquipmentItem[]>(
    initialContract?.coveredEquipment || [
      {
        id: 'eq-new-1',
        name: 'Vertiv Liebert 35kW Precision AC',
        serialNumber: 'VRTV-PAC-9011',
        category: 'HVAC',
        location: 'Datacenter Room 302',
        warrantyStatus: 'Under AMC',
      },
    ]
  );
  const [newEqName, setNewEqName] = useState('');
  const [newEqCategory, setNewEqCategory] = useState('HVAC');
  const [newEqSerial, setNewEqSerial] = useState('');

  // Step 4: Billing & Techs
  const [assignedTechnicians, setAssignedTechnicians] = useState<string[]>(
    initialContract?.assignedTechnicians || ['Rashidul Islam (HVAC Lead)']
  );
  const [newTechName, setNewTechName] = useState('');
  const [autoRenew, setAutoRenew] = useState<boolean>(initialContract?.autoRenew ?? true);

  // Step 5: Signature
  const [signerName, setSignerName] = useState(
    initialContract?.signedBy || customerContactPerson || 'Fahim Rahman'
  );
  const [signatureData, setSignatureData] = useState<string>(
    initialContract?.signature || ''
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Handlers
  const handleAddScope = () => {
    if (!newScopeItem.trim()) return;
    setScopeOfWork([...scopeOfWork, newScopeItem.trim()]);
    setNewScopeItem('');
  };

  const handleRemoveScope = (idx: number) => {
    setScopeOfWork(scopeOfWork.filter((_, i) => i !== idx));
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    setCoveredLocations([...coveredLocations, newLocation.trim()]);
    setNewLocation('');
  };

  const handleRemoveLocation = (idx: number) => {
    setCoveredLocations(coveredLocations.filter((_, i) => i !== idx));
  };

  const handleAddEquipment = () => {
    if (!newEqName.trim()) return;
    setCoveredEquipment([
      ...coveredEquipment,
      {
        id: `eq-${Date.now()}`,
        name: newEqName.trim(),
        category: newEqCategory,
        serialNumber: newEqSerial.trim() || undefined,
        location: coveredLocations[0] || 'Main Facility',
        warrantyStatus: 'Under AMC',
      },
    ]);
    setNewEqName('');
    setNewEqSerial('');
  };

  const handleRemoveEquipment = (id: string) => {
    setCoveredEquipment(coveredEquipment.filter((e) => e.id !== id));
  };

  const handleAddTech = () => {
    if (!newTechName.trim()) return;
    setAssignedTechnicians([...assignedTechnicians, newTechName.trim()]);
    setNewTechName('');
  };

  const handleRemoveTech = (idx: number) => {
    setAssignedTechnicians(assignedTechnicians.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    const finalContract: Contract = {
      id: initialContract?.id || `cnt-${Date.now()}`,
      contractNumber,
      title,
      titleBangla,
      type,
      status: 'active',
      customerId,
      customerName,
      customerContactPerson,
      customerPhone,
      customerEmail,
      customerBin,
      customerAddress,
      startDate,
      endDate,
      value,
      monthlyValue: Math.round(value / 12),
      paymentTerms,
      slaTerms,
      scopeOfWork,
      coveredLocations,
      coveredEquipment,
      assignedTechnicians,
      autoRenew,
      signedAt: new Date().toISOString(),
      signedBy: signerName,
      signature: signatureData,
      slaCompliancePercent: 99.0,
      createdBy: 'Admin Operations',
      createdAt: initialContract?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      serviceHistory: initialContract?.serviceHistory || [],
      paymentMilestones: initialContract?.paymentMilestones || [
        {
          id: `pm-${Date.now()}`,
          invoiceNumber: `INV-${new Date().getFullYear()}-001`,
          dueDate: startDate,
          amountBDT: paymentTerms === 'monthly' ? Math.round(value / 12) : paymentTerms === 'quarterly' ? Math.round(value / 4) : value,
          status: 'PENDING',
          paymentMethod: 'Bank Transfer / BEFTN',
        },
      ],
    };

    onSave(finalContract);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onCancel} className="p-2">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialContract?.id ? 'Edit Service Agreement' : 'New Service Agreement (নতুন চুক্তি তৈরি)'}
            </h1>
            <p className="text-xs text-slate-500">
              Contract #{contractNumber} • AMC & SLA Digital Agreement Wizard
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={onCancel} className="text-xs">
          Cancel
        </Button>
      </div>

      {/* 2. Step Progress Bar */}
      <div className="grid grid-cols-5 gap-2">
        {STEPS.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isCurrent
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 shadow-xs'
                  : isDone
                  ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Step {step.id}
                </span>
                {isDone ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-blue-600 animate-ping' : 'bg-slate-300'}`} />
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {step.title}
              </h4>
              <p className="text-[10px] text-slate-500 truncate hidden sm:block">
                {step.desc}
              </p>
            </button>
          );
        })}
      </div>

      {/* 3. Step Form Body */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              Contract Type, Client & Validity Dates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contract Type (চুক্তির ধরণ) *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as ContractType)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="amc">AMC - Annual Maintenance Contract (বার্ষিক রক্ষণাবেক্ষণ)</option>
                  <option value="sla">SLA - Service Level Agreement (সেবা চুক্তি)</option>
                  <option value="retainer">Retainer Agreement (রিটেইনার চুক্তি)</option>
                  <option value="on_demand">On-Demand Service Contract</option>
                  <option value="project">Project-Based Agreement</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contract Number (অটো জেনারেটেড)
                </label>
                <input
                  type="text"
                  value={contractNumber}
                  readOnly
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-slate-100 dark:bg-slate-800/80 font-mono font-bold text-slate-600 dark:text-slate-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contract Title (English) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grameenphone NOC & Data Center HVAC Maintenance"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contract Title (বাংলা)
                </label>
                <input
                  type="text"
                  value={titleBangla}
                  onChange={(e) => setTitleBangla(e.target.value)}
                  placeholder="e.g. গ্রামীণফোন এনওসি ও ডেটা সেন্টার এইচভিএসি রক্ষণাবেক্ষণ"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Customer / Enterprise (গ্রাহক) *
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  NBR VAT BIN (এনবিআর বিন নম্বর)
                </label>
                <input
                  type="text"
                  value={customerBin}
                  onChange={(e) => setCustomerBin(e.target.value)}
                  placeholder="002938102-0101"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Contact Person (দায়িত্বপ্রাপ্ত কর্মকর্তা)
                </label>
                <input
                  type="text"
                  value={customerContactPerson}
                  onChange={(e) => setCustomerContactPerson(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Phone (মোবাইল নম্বর)
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Start Date (শুরুর তারিখ) *
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  End Date (মেয়াদ সমাপ্তির তারিখ) *
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Total Contract Value in BDT (মোট চুক্তি মূল্য ৳) *
                </label>
                <input
                  type="number"
                  step="10000"
                  value={value}
                  onChange={(e) => setValue(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Equivalent to {formatBDT(value)} (~{Math.round(value / 100000)} Lakh BDT)
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payment Cycle (বিলিং পদ্ধতি) *
                </label>
                <select
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value as ContractPaymentTerms)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="quarterly">Quarterly Advance (ত্রৈমাসিক বিল)</option>
                  <option value="monthly">Monthly Recurring (মাসিক বিল)</option>
                  <option value="annual">Annual Full Payment (বার্ষিক এককালীন)</option>
                  <option value="upfront">Upfront 100% Advance (অগ্রিম ১০০%)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: SLA Commitments */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <SLATermsBuilder
              terms={slaTerms}
              onChange={setSlaTerms}
              readOnly={false}
            />
          </div>
        )}

        {/* Step 3: Scope & Covered Equipment */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Scope of Work */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-blue-600" />
                Service Scope Clauses (সেবার অন্তর্ভুক্ত বিষয়সমূহ)
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newScopeItem}
                  onChange={(e) => setNewScopeItem(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddScope()}
                  placeholder="e.g. Monthly chemical cleaning of condenser coils"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" variant="primary" size="sm" onClick={handleAddScope}>
                  Add Clause
                </Button>
              </div>

              <div className="space-y-1.5">
                {scopeOfWork.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <span>{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveScope(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Covered Facilities / Locations */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                Covered Sites & Facilities
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLocation()}
                  placeholder="e.g. Mirpur Section 10 Grid Substation, Dhaka"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddLocation}>
                  Add Site
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coveredLocations.map((loc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <span className="truncate">{loc}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Covered Equipment List */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600" />
                Covered Machinery & Asset Items
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <input
                  type="text"
                  value={newEqName}
                  onChange={(e) => setNewEqName(e.target.value)}
                  placeholder="Equipment Name (e.g. Carrier 120-Ton Chiller)"
                  className="sm:col-span-2 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newEqSerial}
                  onChange={(e) => setNewEqSerial(e.target.value)}
                  placeholder="Serial # (Optional)"
                  className="px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddEquipment}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Equipment
                </Button>
              </div>

              <div className="space-y-2">
                {coveredEquipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <div>
                      <strong className="text-slate-900 dark:text-white">{eq.name}</strong>
                      {eq.serialNumber && <span className="font-mono text-slate-400 ml-2">({eq.serialNumber})</span>}
                      <span className="text-slate-500 text-[11px] block">{eq.category} • {eq.location}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEquipment(eq.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Billing Terms & Technicians */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Auto Renewal & VAT Settings */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Renewal & Bangladesh NBR Taxation Rules
              </h4>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRenew}
                  onChange={(e) => setAutoRenew(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">
                    Auto-Renewal on Expiration (স্বয়ংক্রিয় নবায়ন)
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Contract will automatically roll over for another 12-month term with standard 5% inflation adjustment unless 30-day notice is given.
                  </span>
                </div>
              </label>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[11px] text-slate-500">
                  NBR VAT Policy: All generated invoices will carry mandatory 15% VAT and generate Government Mushak-6.3 challans automatically.
                </span>
              </div>
            </div>

            {/* Assigned Technicians */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                Assigned Primary Technical Personnel
              </h4>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechName}
                  onChange={(e) => setNewTechName(e.target.value)}
                  placeholder="e.g. Kamrul Hasan (High Voltage Specialist)"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddTech}>
                  Assign Engineer
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {assignedTechnicians.map((tech, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Digital Signature */}
        {currentStep === 5 && (
          <div className="space-y-6">
            {/* Agreement Summary Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Agreement Execution Summary
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">Contract #</span>
                  <strong className="text-slate-900 dark:text-white font-mono">{contractNumber}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Client</span>
                  <strong className="text-slate-900 dark:text-white">{customerName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Duration</span>
                  <strong className="text-slate-900 dark:text-white">{startDate} to {endDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Total Value</span>
                  <strong className="text-blue-600 dark:text-blue-400">{formatBDT(value)}</strong>
                </div>
              </div>
            </div>

            {/* Signature Pad */}
            <DigitalSignature
              signerName={signerName}
              onSignerNameChange={setSignerName}
              onSignatureCapture={setSignatureData}
              existingSignature={signatureData}
            />

            {/* Legal Agreement Checkbox */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  I confirm that all provided details, SLA matrices, and customer authorizations are accurate. Executing this agreement activates automated SLA monitoring and legally binds FieldOps Pro Engineering Ltd.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* 4. Form Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800 mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
            disabled={currentStep === 1}
            className="text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Previous
          </Button>

          {currentStep < 5 ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setCurrentStep((s) => Math.min(5, s + 1))}
              className="text-xs"
            >
              Next Step ({STEPS[currentStep].title})
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              disabled={!signerName.trim() || !agreedToTerms}
              onClick={handleSubmit}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <Check className="w-4 h-4 mr-1" />
              Sign & Activate Agreement (চুক্তি চূড়ান্ত করুন)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
