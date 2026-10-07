import { Contract, ContractStats, PriorityLevel, SLATerm } from '../types/contracts';

export const DEFAULT_SLA_TERMS: SLATerm[] = [
  {
    priority: 'emergency',
    responseTimeHours: 1,
    resolutionTimeHours: 4,
    penalty: 5000,
    uptimeGuaranteePercent: 99.9,
  },
  {
    priority: 'critical',
    responseTimeHours: 2,
    resolutionTimeHours: 8,
    penalty: 2500,
    uptimeGuaranteePercent: 99.5,
  },
  {
    priority: 'high',
    responseTimeHours: 4,
    resolutionTimeHours: 24,
    penalty: 1000,
    uptimeGuaranteePercent: 99.0,
  },
  {
    priority: 'medium',
    responseTimeHours: 8,
    resolutionTimeHours: 48,
    penalty: 500,
    uptimeGuaranteePercent: 98.0,
  },
  {
    priority: 'low',
    responseTimeHours: 24,
    resolutionTimeHours: 72,
    penalty: 0,
    uptimeGuaranteePercent: 95.0,
  },
];

export const INITIAL_CONTRACTS: Contract[] = [
  {
    id: 'cnt-2026-001',
    contractNumber: 'AMC-2026-0001',
    title: 'Grameenphone NOC & Data Center HVAC Maintenance',
    titleBangla: 'গ্রামীণফোন এনওসি ও ডেটা সেন্টার এইচভিএসি বার্ষিক রক্ষণাবেক্ষণ',
    type: 'amc',
    status: 'active',
    customerId: 'cust-gp-hq',
    customerName: 'Grameenphone Telecom Ltd',
    customerContactPerson: 'Fahim Rahman',
    customerPhone: '+880 1712-345678',
    customerEmail: 'noc.procurement@grameenphone.com',
    customerAddress: 'GP House, Bashundhara R/A, Dhaka-1229',
    customerBin: '002938102-0101',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    value: 850000, // 8.5 Lakh BDT
    monthlyValue: 70833,
    paymentTerms: 'quarterly',
    slaTerms: [
      { priority: 'emergency', responseTimeHours: 1, resolutionTimeHours: 4, penalty: 10000, uptimeGuaranteePercent: 99.9 },
      { priority: 'critical', responseTimeHours: 2, resolutionTimeHours: 8, penalty: 5000, uptimeGuaranteePercent: 99.5 },
      { priority: 'high', responseTimeHours: 4, resolutionTimeHours: 24, penalty: 2000, uptimeGuaranteePercent: 99.0 },
      { priority: 'medium', responseTimeHours: 8, resolutionTimeHours: 48, penalty: 1000, uptimeGuaranteePercent: 98.0 },
      { priority: 'low', responseTimeHours: 24, resolutionTimeHours: 72, penalty: 0, uptimeGuaranteePercent: 95.0 },
    ],
    scopeOfWork: [
      '24/7 emergency response for GP Tier-3 Data Center Precision Air Conditioners (PAC)',
      'Monthly comprehensive preventive maintenance and refrigerant leak check',
      'Quarterly chilled water pump bearing inspection and filter replacements',
      'Annual condenser chemical wash and compressor efficiency audit',
      'Free replacement of minor consumable spares (fuses, thermistors, air filters)',
    ],
    coveredLocations: [
      'GP House - Tier 3 Datacenter, Bashundhara R/A, Dhaka',
      'Gulshan 2 Switch Station, Road 113, Dhaka',
      'Agrabad Regional NOC, Chattogram',
    ],
    coveredEquipment: [
      { id: 'eq-1', name: 'Vertiv Liebert CRV 35kW Precision AC', serialNumber: 'VRTV-PAC-8910', category: 'HVAC', location: 'GP House Room 302', warrantyStatus: 'Under AMC' },
      { id: 'eq-2', name: 'Schneider Uniflair 45kW Chilled Water Unit', serialNumber: 'SCHN-UFL-4402', category: 'HVAC', location: 'GP House Room 304', warrantyStatus: 'Under AMC' },
      { id: 'eq-3', name: 'Carrier 120-Ton Screw Chiller Primary', serialNumber: 'CARR-120S-001', category: 'Chiller', location: 'Basement Chiller Plant', warrantyStatus: 'Under AMC' },
    ],
    assignedTechnicians: ['Rashidul Islam (HVAC Lead)', 'Tanvir Ahmed (Refrigeration Tech)'],
    autoRenew: true,
    signedAt: '2025-03-28',
    signedBy: 'Fahim Rahman (IT Ops Manager, GP)',
    signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><path d="M10 40 Q 60 10 100 35 T 190 20" fill="none" stroke="%231e3a8a" stroke-width="3"/></svg>',
    slaCompliancePercent: 98.6,
    notes: 'High-availability enterprise SLA with NBR Mushak-6.3 VAT billing at 15%. Quarterly advance invoice required by GP procurement protocol.',
    createdBy: 'Admin Operations',
    createdAt: '2025-03-20',
    updatedAt: '2026-01-15',
    serviceHistory: [
      {
        id: 'rec-1',
        workOrderId: 'WO-2026-0142',
        serviceDate: '2026-01-10',
        serviceTitle: 'Emergency Fan Motor Vibration Fault in PAC-02',
        technicianName: 'Rashidul Islam',
        status: 'COMPLETED',
        slaMet: true,
        responseTimeMinutes: 38,
        resolutionTimeMinutes: 145,
        costBDT: 14500,
      },
      {
        id: 'rec-2',
        workOrderId: 'WO-2025-0899',
        serviceDate: '2025-12-05',
        serviceTitle: 'Quarterly Routine Maintenance & Filter Clean',
        technicianName: 'Tanvir Ahmed',
        status: 'COMPLETED',
        slaMet: true,
        responseTimeMinutes: 45,
        resolutionTimeMinutes: 210,
        costBDT: 0,
      },
      {
        id: 'rec-3',
        workOrderId: 'WO-2025-0621',
        serviceDate: '2025-09-18',
        serviceTitle: 'Chilled Water Sensor Calibration & Glycol Top-up',
        technicianName: 'Rashidul Islam',
        status: 'COMPLETED',
        slaMet: true,
        responseTimeMinutes: 52,
        resolutionTimeMinutes: 180,
        costBDT: 8500,
      },
    ],
    paymentMilestones: [
      { id: 'pm-1', invoiceNumber: 'INV-2025-0401', dueDate: '2025-04-15', amountBDT: 212500, status: 'PAID', paidDate: '2025-04-12', paymentMethod: 'City Bank Corporate BEFTN', trxId: 'CBL-GP-992102' },
      { id: 'pm-2', invoiceNumber: 'INV-2025-0701', dueDate: '2025-07-15', amountBDT: 212500, status: 'PAID', paidDate: '2025-07-10', paymentMethod: 'Standard Chartered EFT', trxId: 'SCB-883921' },
      { id: 'pm-3', invoiceNumber: 'INV-2025-1001', dueDate: '2025-10-15', amountBDT: 212500, status: 'PAID', paidDate: '2025-10-14', paymentMethod: 'City Bank Corporate BEFTN', trxId: 'CBL-GP-103982' },
      { id: 'pm-4', invoiceNumber: 'INV-2026-0101', dueDate: '2026-01-20', amountBDT: 212500, status: 'PAID', paidDate: '2026-01-18', paymentMethod: 'City Bank Corporate BEFTN', trxId: 'CBL-GP-118832' },
    ],
  },
  {
    id: 'cnt-2026-002',
    contractNumber: 'SLA-2025-0002',
    title: 'DESCO Mirpur Substation Transformer & RMU Monitoring',
    titleBangla: 'ডেসকো মিরপুর সাবস্টেশন ট্রান্সফরমার ও আরএমইউ নজরদারি',
    type: 'sla',
    status: 'expiring_soon',
    customerId: 'cust-desco-hq',
    customerName: 'Dhaka Electric Supply Company (DESCO)',
    customerContactPerson: 'Engr. Nazmul Haque',
    customerPhone: '+880 1819-234567',
    customerEmail: 'maintenance.mirpur@desco.org.bd',
    customerAddress: 'DESCO Bhaban, Kallyanpur, Dhaka-1207',
    customerBin: '001188291-0102',
    startDate: '2025-02-15',
    endDate: '2026-02-14', // Expiring in ~10 days!
    value: 240000, // 2.4 Lakh BDT
    monthlyValue: 20000,
    paymentTerms: 'monthly',
    slaTerms: [
      { priority: 'emergency', responseTimeHours: 1, resolutionTimeHours: 3, penalty: 8000, uptimeGuaranteePercent: 99.8 },
      { priority: 'critical', responseTimeHours: 2, resolutionTimeHours: 6, penalty: 4000, uptimeGuaranteePercent: 99.2 },
      { priority: 'high', responseTimeHours: 4, resolutionTimeHours: 12, penalty: 1500, uptimeGuaranteePercent: 98.5 },
      { priority: 'medium', responseTimeHours: 8, resolutionTimeHours: 24, penalty: 500, uptimeGuaranteePercent: 97.0 },
      { priority: 'low', responseTimeHours: 24, resolutionTimeHours: 48, penalty: 0, uptimeGuaranteePercent: 95.0 },
    ],
    scopeOfWork: [
      '24/7 breakdown call-out for 33/11kV Substation Power Transformers',
      'Gas density and SF6 circuit breaker leak monitoring',
      'Monthly thermal imaging of busbars and drop-out fuses',
      'Bi-monthly transformer oil BDV (Breakdown Voltage) dielectric test',
    ],
    coveredLocations: [
      'Mirpur Section 10 Grid Substation, Dhaka',
      'Pallabi 33kV Distribution Substation, Dhaka',
    ],
    coveredEquipment: [
      { id: 'eq-4', name: 'Energypac 20/28 MVA 33/11kV Transformer', serialNumber: 'ENP-33KV-902', category: 'Transformer', location: 'Mirpur-10 Yard', warrantyStatus: 'Under AMC' },
      { id: 'eq-5', name: 'ABB UniGear ZS1 11kV Switchgear RMU', serialNumber: 'ABB-UG-7832', category: 'Switchgear', location: 'Pallabi Indoor Room', warrantyStatus: 'Under AMC' },
    ],
    assignedTechnicians: ['Kamrul Hasan (High Voltage Specialist)', 'Mohsin Ali (Electrical Tech)'],
    autoRenew: false,
    signedAt: '2025-02-10',
    signedBy: 'Engr. Nazmul Haque (Executive Engineer, DESCO)',
    slaCompliancePercent: 95.8,
    notes: 'Urgent renewal proposal submitted. Contract expiring in February 2026. Proposed 10% rate revision due to material cost inflation.',
    createdBy: 'Kamrul Hasan',
    createdAt: '2025-02-01',
    updatedAt: '2026-01-20',
    serviceHistory: [
      {
        id: 'rec-4',
        workOrderId: 'WO-2025-0988',
        serviceDate: '2025-12-28',
        serviceTitle: 'Silica Gel Breather Replacement & Bushing Seal Repair',
        technicianName: 'Kamrul Hasan',
        status: 'COMPLETED',
        slaMet: true,
        responseTimeMinutes: 40,
        resolutionTimeMinutes: 160,
        costBDT: 6200,
      },
    ],
    paymentMilestones: [
      { id: 'pm-5', invoiceNumber: 'INV-2025-1201', dueDate: '2025-12-31', amountBDT: 20000, status: 'PAID', paidDate: '2026-01-05', paymentMethod: 'Sonali Bank Treasury Challan', trxId: 'SB-DES-482109' },
      { id: 'pm-6', invoiceNumber: 'INV-2026-0101', dueDate: '2026-01-31', amountBDT: 20000, status: 'PENDING', paymentMethod: 'Bank Transfer' },
    ],
  },
  {
    id: 'cnt-2026-003',
    contractNumber: 'AMC-2025-0015',
    title: 'Apex Footwear Factory Conveyor & Compressed Air AMC',
    titleBangla: 'অ্যাপেক্স ফুটওয়্যার ফ্যাক্টরি কনভেয়র ও কম্প্রেসড এয়ার এএমসি',
    type: 'amc',
    status: 'active',
    customerId: 'cust-apex-gazipur',
    customerName: 'Apex Footwear Ltd',
    customerContactPerson: 'Tareq Mahmud',
    customerPhone: '+880 1913-889900',
    customerEmail: 'factory.maintenance@apexfootwearltd.com',
    customerAddress: 'Shafipur, Kaliakoir, Gazipur-1750',
    customerBin: '003889104-0201',
    startDate: '2025-07-01',
    endDate: '2026-06-30',
    value: 1200000, // 12 Lakh BDT
    monthlyValue: 100000,
    paymentTerms: 'quarterly',
    slaTerms: DEFAULT_SLA_TERMS,
    scopeOfWork: [
      'Comprehensive maintenance of 4 assembly line motor-driven conveyors',
      'Atlas Copco oil-free rotary screw compressors bi-weekly inspection',
      'Emergency technician dispatch within 2 hours during active shift hours (8am - 10pm)',
      'Supply of pneumatic solenoid valves, pressure switches, and synthetic lubricants',
    ],
    coveredLocations: ['Plant 1 & Plant 2, Shafipur Industrial Zone, Gazipur'],
    coveredEquipment: [
      { id: 'eq-6', name: 'Atlas Copco ZR55 Oil-Free Screw Compressor', serialNumber: 'AC-ZR55-091', category: 'Compressor', location: 'Utility Bay 1', warrantyStatus: 'Under AMC' },
      { id: 'eq-7', name: 'Interroll Sorter Conveyor Line A & B', serialNumber: 'IR-SRT-2021', category: 'Conveyor', location: 'Stitching Floor', warrantyStatus: 'Under AMC' },
    ],
    assignedTechnicians: ['Sumon Mia (Factory Automation Engr)', 'Rezaul Karim (Mechanical Tech)'],
    autoRenew: true,
    signedAt: '2025-06-25',
    signedBy: 'Tareq Mahmud (Factory Plant Head)',
    slaCompliancePercent: 99.1,
    createdBy: 'Sumon Mia',
    createdAt: '2025-06-15',
    updatedAt: '2026-01-05',
    serviceHistory: [],
    paymentMilestones: [
      { id: 'pm-7', invoiceNumber: 'INV-2025-0705', dueDate: '2025-07-20', amountBDT: 300000, status: 'PAID', paidDate: '2025-07-18', paymentMethod: 'BRAC Bank BEFTN', trxId: 'BRAC-APX-8819' },
      { id: 'pm-8', invoiceNumber: 'INV-2025-1005', dueDate: '2025-10-20', amountBDT: 300000, status: 'PAID', paidDate: '2025-10-19', paymentMethod: 'BRAC Bank BEFTN', trxId: 'BRAC-APX-9942' },
      { id: 'pm-9', invoiceNumber: 'INV-2026-0105', dueDate: '2026-01-20', amountBDT: 300000, status: 'PAID', paidDate: '2026-01-16', paymentMethod: 'BRAC Bank BEFTN', trxId: 'BRAC-APX-10492' },
      { id: 'pm-10', invoiceNumber: 'INV-2026-0405', dueDate: '2026-04-20', amountBDT: 300000, status: 'PENDING', paymentMethod: 'BRAC Bank BEFTN' },
    ],
  },
  {
    id: 'cnt-2026-004',
    contractNumber: 'SLA-2025-0008',
    title: 'Beximco Pharmaceuticals Cleanroom HVAC & HEPA Filter SLA',
    titleBangla: 'বেক্সিমকো ফার্মাসিউটিক্যালস ক্লিনরুম এইচভিএসি ও হেপা ফিল্টার এসএলএ',
    type: 'sla',
    status: 'expiring_soon',
    customerId: 'cust-beximco-pharma',
    customerName: 'Beximco Pharmaceuticals Ltd',
    customerContactPerson: 'Dr. Shahriar Kabir',
    customerPhone: '+880 1711-556677',
    customerEmail: 'sterile.engineering@beximco-pharma.com',
    customerAddress: 'Tongi Industrial Area, Gazipur-1711',
    customerBin: '001928374-0301',
    startDate: '2025-03-01',
    endDate: '2026-02-28', // Expiring in ~25 days!
    value: 1650000, // 16.5 Lakh BDT
    monthlyValue: 137500,
    paymentTerms: 'quarterly',
    slaTerms: [
      { priority: 'emergency', responseTimeHours: 1, resolutionTimeHours: 2, penalty: 20000, uptimeGuaranteePercent: 99.95 },
      { priority: 'critical', responseTimeHours: 2, resolutionTimeHours: 4, penalty: 10000, uptimeGuaranteePercent: 99.8 },
      { priority: 'high', responseTimeHours: 4, resolutionTimeHours: 12, penalty: 5000, uptimeGuaranteePercent: 99.0 },
      { priority: 'medium', responseTimeHours: 8, resolutionTimeHours: 24, penalty: 2000, uptimeGuaranteePercent: 98.0 },
      { priority: 'low', responseTimeHours: 24, resolutionTimeHours: 48, penalty: 0, uptimeGuaranteePercent: 95.0 },
    ],
    scopeOfWork: [
      'ISO Class 5 & 7 Cleanroom air balance, differential pressure, and air change velocity audits',
      'PAO DOP aerosol filter integrity testing (HEPA / ULPA filters)',
      'Emergency response for air handling unit (AHU) motor or belt failures within 1 hour',
      'Strict US FDA cGMP compliant documentation and field service records',
    ],
    coveredLocations: ['Sterile Injectables Plant & Solid Dosage Block, Tongi Factory'],
    coveredEquipment: [
      { id: 'eq-8', name: 'Eurovent Certified 20,000 CFM Sterile AHU', serialNumber: 'EV-AHU-20K-01', category: 'HVAC Cleanroom', location: 'Sterile Block Roof', warrantyStatus: 'Under AMC' },
      { id: 'eq-9', name: 'Camfil Megalam H14 Terminal HEPA Modules', serialNumber: 'CAM-H14-990', category: 'Air Filtration', location: 'Cleanroom Ceilings', warrantyStatus: 'Under AMC' },
    ],
    assignedTechnicians: ['Rashidul Islam (HVAC Lead)', 'Shahadat Hossain (Cleanroom Certification Engr)'],
    autoRenew: false,
    signedAt: '2025-02-25',
    signedBy: 'Dr. Shahriar Kabir (General Manager, Engineering)',
    slaCompliancePercent: 99.8,
    notes: 'Critical cGMP pharmaceutical compliance. Zero contamination tolerance. Renewal quote under management review.',
    createdBy: 'Rashidul Islam',
    createdAt: '2025-02-15',
    updatedAt: '2026-01-22',
    serviceHistory: [],
    paymentMilestones: [
      { id: 'pm-11', invoiceNumber: 'INV-2025-0315', dueDate: '2025-03-31', amountBDT: 412500, status: 'PAID', paidDate: '2025-03-29', paymentMethod: 'Dutch-Bangla Bank EFT', trxId: 'DBBL-BEX-1102' },
      { id: 'pm-12', invoiceNumber: 'INV-2025-0615', dueDate: '2025-06-30', amountBDT: 412500, status: 'PAID', paidDate: '2025-06-28', paymentMethod: 'Dutch-Bangla Bank EFT', trxId: 'DBBL-BEX-3341' },
      { id: 'pm-13', invoiceNumber: 'INV-2025-0915', dueDate: '2025-09-30', amountBDT: 412500, status: 'PAID', paidDate: '2025-09-28', paymentMethod: 'Dutch-Bangla Bank EFT', trxId: 'DBBL-BEX-7782' },
      { id: 'pm-14', invoiceNumber: 'INV-2025-1215', dueDate: '2025-12-31', amountBDT: 412500, status: 'PAID', paidDate: '2025-12-30', paymentMethod: 'Dutch-Bangla Bank EFT', trxId: 'DBBL-BEX-9921' },
    ],
  },
  {
    id: 'cnt-2026-005',
    contractNumber: 'AMC-2024-0044',
    title: 'Square Hospital Medical Gas & Diesel Generator Retainer',
    titleBangla: 'স্কয়ার হাসপাতাল মেডিকেল গ্যাস ও ডিজেল জেনারেটর রিটেইনার',
    type: 'retainer',
    status: 'active',
    customerId: 'cust-square-hosp',
    customerName: 'Square Hospitals Ltd',
    customerContactPerson: 'Brig. Gen. (Retd) M. Rahman',
    customerPhone: '+880 1713-001122',
    customerEmail: 'biomedical.dept@squarehospital.com',
    customerAddress: '18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka-1205',
    customerBin: '002819023-0101',
    startDate: '2025-01-01',
    endDate: '2026-12-31', // 2-year Retainer
    value: 1800000, // 18 Lakh BDT
    monthlyValue: 75000,
    paymentTerms: 'monthly',
    slaTerms: [
      { priority: 'emergency', responseTimeHours: 0.5, resolutionTimeHours: 2, penalty: 25000, uptimeGuaranteePercent: 99.99 },
      { priority: 'critical', responseTimeHours: 1, resolutionTimeHours: 4, penalty: 12000, uptimeGuaranteePercent: 99.9 },
      { priority: 'high', responseTimeHours: 3, resolutionTimeHours: 8, penalty: 5000, uptimeGuaranteePercent: 99.0 },
      { priority: 'medium', responseTimeHours: 6, resolutionTimeHours: 18, penalty: 2000, uptimeGuaranteePercent: 98.0 },
      { priority: 'low', responseTimeHours: 12, resolutionTimeHours: 36, penalty: 0, uptimeGuaranteePercent: 95.0 },
    ],
    scopeOfWork: [
      'Dedicated standby on-call technician 24/7 for Hospital Medical Oxygen Manifold & Vacuum pumps',
      'Emergency diesel generator synchronization panel check every 7 days',
      'Guaranteed 30-minute arrival for ICU / Operation Theatre life-support power outages',
      'Automatic monthly invoice generation with VAT 15% NBR Mushak-6.3',
    ],
    coveredLocations: ['Main Hospital Building, ICU Floors 4-6, West Panthapath, Dhaka'],
    coveredEquipment: [
      { id: 'eq-10', name: 'Cummins 1500 kVA Soundproof Generator QSK50', serialNumber: 'CUMM-1500-88', category: 'Generator', location: 'Basement 2 Gen-Set Room', warrantyStatus: 'Under AMC' },
      { id: 'eq-11', name: 'BeaconMedaes Duplex Medical Vacuum System', serialNumber: 'BM-VAC-449', category: 'Medical Gas', location: 'Roof Plant Room', warrantyStatus: 'Under AMC' },
    ],
    assignedTechnicians: ['Kamrul Hasan (High Voltage Specialist)', 'Alamgir Hossain (Biomedical Tech)'],
    autoRenew: true,
    signedAt: '2024-12-28',
    signedBy: 'Brig. Gen. (Retd) M. Rahman (Director Facilities)',
    slaCompliancePercent: 99.9,
    createdBy: 'Admin Operations',
    createdAt: '2024-12-20',
    updatedAt: '2026-01-10',
    serviceHistory: [],
    paymentMilestones: [
      { id: 'pm-15', invoiceNumber: 'INV-2026-0102', dueDate: '2026-01-15', amountBDT: 75000, status: 'PAID', paidDate: '2026-01-12', paymentMethod: 'Bank Asia BEFTN', trxId: 'BA-SQH-9011' },
      { id: 'pm-16', invoiceNumber: 'INV-2026-0202', dueDate: '2026-02-15', amountBDT: 75000, status: 'PENDING', paymentMethod: 'Bank Transfer' },
    ],
  },
  {
    id: 'cnt-2026-006',
    contractNumber: 'ODC-2025-0019',
    title: 'Dhaka WASA Saidabad Water Treatment Plant On-demand Overhaul',
    titleBangla: 'ঢাকা ওয়াসা সায়েদাবাদ ওয়াটার ট্রিটমেন্ট প্ল্যান্ট অন-ডিমান্ড ওভারহোলিং',
    type: 'on_demand',
    status: 'expired',
    customerId: 'cust-wasa-dhaka',
    customerName: 'Dhaka Water Supply and Sewerage Authority (WASA)',
    customerContactPerson: 'Engr. Mofazzal Hossain',
    customerPhone: '+880 1817-998877',
    customerEmail: 'procurement@dwasa.org.bd',
    customerAddress: 'WASA Bhaban, 98 Kazi Nazrul Islam Avenue, Kawran Bazar, Dhaka-1215',
    customerBin: '001239841-0101',
    startDate: '2024-11-01',
    endDate: '2025-10-31', // Expired
    value: 550000, // 5.5 Lakh BDT
    monthlyValue: 45833,
    paymentTerms: 'upfront',
    slaTerms: DEFAULT_SLA_TERMS,
    scopeOfWork: [
      'On-demand servicing of 6 high-pressure centrifugal raw water pumps',
      'Vibration analysis and laser alignment of pump shafts',
      'Impeller dynamic balancing and mechanical seal replacement',
    ],
    coveredLocations: ['Saidabad Water Treatment Plant Phase-1, Dhaka'],
    coveredEquipment: [
      { id: 'eq-12', name: 'Kirloskar 250 kW Centrifugal High Flow Pump', serialNumber: 'KIR-250-9901', category: 'Pump', location: 'Intake Pump House', warrantyStatus: 'Expired' },
    ],
    assignedTechnicians: ['Rezaul Karim (Mechanical Tech)'],
    autoRenew: false,
    signedAt: '2024-10-25',
    signedBy: 'Engr. Mofazzal Hossain (Superintending Engineer)',
    slaCompliancePercent: 94.2,
    createdBy: 'Kamrul Hasan',
    createdAt: '2024-10-15',
    updatedAt: '2025-11-01',
    serviceHistory: [],
    paymentMilestones: [
      { id: 'pm-17', invoiceNumber: 'INV-2024-1101', dueDate: '2024-11-15', amountBDT: 550000, status: 'PAID', paidDate: '2024-11-20', paymentMethod: 'Sonali Bank Cheque', trxId: 'SB-WASA-1192' },
    ],
  },
  {
    id: 'cnt-2026-007',
    contractNumber: 'PRJ-2026-0004',
    title: 'Pran-RFL Industrial Park Solar Inverter & Substation Setup',
    titleBangla: 'প্রাণ-আরএফএল ইন্ডাস্ট্রিয়াল পার্ক সোলার ইনভার্টার ও সাবস্টেশন সেটআপ',
    type: 'project',
    status: 'draft',
    customerId: 'cust-pran-rfl',
    customerName: 'PRAN-RFL Group',
    customerContactPerson: 'Mirza Golam Sarwar',
    customerPhone: '+880 1714-332211',
    customerEmail: 'projects.energy@pranrflgroup.com',
    customerAddress: 'PRAN-RFL Center, 105 Middle Badda, Dhaka-1212',
    customerBin: '003299182-0101',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    value: 920000, // 9.2 Lakh BDT
    monthlyValue: 153333,
    paymentTerms: 'quarterly',
    slaTerms: DEFAULT_SLA_TERMS,
    scopeOfWork: [
      'Turnkey testing, commissioning and 6-month operation SLA for 500kW rooftop solar system',
      'Integration of 5 Sungrow string inverters with central SCADA telemetry',
      'Grid tie synchronization with PGCB national grid and net-metering setup',
    ],
    coveredLocations: ['PRAN Industrial Park, Ghorashal, Narsingdi'],
    coveredEquipment: [
      { id: 'eq-13', name: 'Sungrow SG110CX Multi-MPPT Grid Inverter', serialNumber: 'SG-110CX-01', category: 'Solar', location: 'Rooftop Inverter Station', warrantyStatus: 'Under Manufacturer' },
    ],
    assignedTechnicians: ['Kamrul Hasan (High Voltage Specialist)'],
    autoRenew: false,
    slaCompliancePercent: 100,
    notes: 'Draft under negotiation with PRAN-RFL energy procurement committee.',
    createdBy: 'Kamrul Hasan',
    createdAt: '2026-01-20',
    updatedAt: '2026-01-20',
    serviceHistory: [],
    paymentMilestones: [],
  },
];

export function calculateContractStats(contracts: Contract[]): ContractStats {
  const activeCount = contracts.filter((c) => c.status === 'active').length;
  const expiringCount = contracts.filter((c) => c.status === 'expiring_soon').length;
  const expiredCount = contracts.filter((c) => c.status === 'expired').length;
  const draftCount = contracts.filter((c) => c.status === 'draft').length;

  const totalValueBDT = contracts
    .filter((c) => c.status === 'active' || c.status === 'expiring_soon')
    .reduce((sum, c) => sum + (c.value || 0), 0);

  const monthlyRecurringRevenueBDT = contracts
    .filter((c) => c.status === 'active' || c.status === 'expiring_soon')
    .reduce((sum, c) => sum + (c.monthlyValue || (c.value ? Math.round(c.value / 12) : 0)), 0);

  const validCompliance = contracts.filter((c) => c.slaCompliancePercent !== undefined);
  const avgSlaCompliancePercent = validCompliance.length > 0
    ? Number((validCompliance.reduce((sum, c) => sum + (c.slaCompliancePercent || 0), 0) / validCompliance.length).toFixed(1))
    : 98.4;

  return {
    totalContracts: contracts.length,
    activeCount,
    expiringCount,
    expiredCount,
    draftCount,
    totalValueBDT,
    monthlyRecurringRevenueBDT,
    avgSlaCompliancePercent,
  };
}

export function formatBDT(amount: number): string {
  // Format as Bangladesh Taka, e.g. ৳8,50,000 or ৳12.5L
  return `৳${amount.toLocaleString('en-IN')}`;
}

export function formatBDTLakh(amount: number): string {
  if (amount >= 10000000) {
    return `৳${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `৳${(amount / 100000).toFixed(1)}L`;
  }
  return formatBDT(amount);
}
