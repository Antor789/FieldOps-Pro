import React, { useState } from 'react';
import { Modal } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Input, FloatingInput } from '../../ui/Input';
import { WorkOrder, WorkOrderPriority } from '../../../types/fsm';
import { Language, formatBDT } from '../../../lib/i18n';
import { useToast } from '../../../context/ToastContext';
import {
  Building,
  MapPin,
  Clock,
  Banknote,
  AlertTriangle,
  Flame,
  Plus,
  Sparkles,
  Phone,
} from 'lucide-react';

interface FSMCreateWorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWorkOrder: (order: Partial<WorkOrder>) => void;
  lang: Language;
}

export const FSMCreateWorkOrderModal: React.FC<FSMCreateWorkOrderModalProps> = ({
  isOpen,
  onClose,
  onCreateWorkOrder,
  lang,
}) => {
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhoneBd, setCustomerPhoneBd] = useState('01711-009988');
  const [siteName, setSiteName] = useState('Dhaka North NOC Center');
  const [landmark, setLandmark] = useState('Gulshan 2, Near DCC Market');
  const [priority, setPriority] = useState<WorkOrderPriority>('HIGH');
  const [priceBDT, setPriceBDT] = useState('7500');
  const [skills, setSkills] = useState('FIBER_SPLICING, OTDR_TEST');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !customerName) return;

    const newOrder: Partial<WorkOrder> = {
      title,
      customerName,
      customerPhoneBd,
      siteName,
      locationPoint: {
        latitude: 23.7925 + (Math.random() - 0.5) * 0.05,
        longitude: 90.4078 + (Math.random() - 0.5) * 0.05,
        division: 'DHAKA',
        district: 'Dhaka',
        thana: 'Gulshan',
        address: landmark,
        landmark,
      },
      priority,
      status: 'PENDING',
      pricingEstimatedBDT: Number(priceBDT) || 5000,
      requiredSkills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      slaDeadline: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };

    onCreateWorkOrder(newOrder);
    onClose();
    addToast({
      title: 'Work Order Created',
      description: `${title} added to unassigned queue.`,
      type: 'success',
    });

    // Reset Form
    setTitle('');
    setCustomerName('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
            +WO
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              {lang === 'bn' ? 'নতুন ওয়ার্ক অর্ডার তৈরি করুন' : 'Create New Bangladesh Work Order'}
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Dhaka Landmark Geocoding & NBR BDT Pricing
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-end space-x-2 w-full">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Create & Add to Queue
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title */}
        <Input
          label="Job Title / Summary *"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Substation Transformer Outage Emergency"
        />

        {/* Customer & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Customer / Client Name *"
            required
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="e.g. Grameenphone HQ"
            leftIcon={<Building className="w-3.5 h-3.5" />}
          />

          <Input
            label="Customer Mobile (BD +880)"
            value={customerPhoneBd}
            onChange={(e) => setCustomerPhoneBd(e.target.value)}
            placeholder="01711-XXXXXX"
            leftIcon={<Phone className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Landmark Address & Site */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Bangladesh Landmark Address"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            placeholder="e.g. Near Gulshan 2 DCC Market"
            leftIcon={<MapPin className="w-3.5 h-3.5" />}
          />

          <Input
            label="Operational Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="e.g. Banani Substation #2"
          />
        </div>

        {/* Priority & BDT Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as WorkOrderPriority)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="EMERGENCY">EMERGENCY (30-min SLA)</option>
              <option value="CRITICAL">CRITICAL (1-hour SLA)</option>
              <option value="HIGH">HIGH Priority (2-hour SLA)</option>
              <option value="MEDIUM">MEDIUM (4-hour SLA)</option>
              <option value="LOW">LOW Priority</option>
            </select>
          </div>

          <Input
            label="Estimated BDT Amount (৳)"
            value={priceBDT}
            onChange={(e) => setPriceBDT(e.target.value)}
            placeholder="5000"
            leftIcon={<Banknote className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Required Skills */}
        <Input
          label="Required Technician Skills (Comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="FIBER_SPLICING, OTDR_TEST, HIGH_VOLTAGE"
        />
      </form>
    </Modal>
  );
};
