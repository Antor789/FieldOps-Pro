import { TemplateVariableDefinition, EmailTemplateType } from '../types/email';

export const TEMPLATE_VARIABLES: TemplateVariableDefinition[] = [
  // Customer variables
  {
    key: 'customer_name',
    name: 'Customer Name',
    nameBangla: 'গ্রাহকের নাম',
    category: 'customer',
    sampleValue: 'Engr. Mahfuzur Rahman',
    description: 'Full name of the customer or authorized site contact',
  },
  {
    key: 'customer_phone',
    name: 'Customer Phone',
    nameBangla: 'গ্রাহকের ফোন',
    category: 'customer',
    sampleValue: '+880 1712-345678',
    description: 'Customer contact number in Bangladesh format',
  },
  {
    key: 'customer_email',
    name: 'Customer Email',
    nameBangla: 'গ্রাহকের ইমেইল',
    category: 'customer',
    sampleValue: 'mahfuz@grameenphone.com',
    description: 'Email address of the customer',
  },
  {
    key: 'customer_bin',
    name: 'Customer BIN/TIN',
    nameBangla: 'গ্রাহকের বিআইএন/টিআইএন',
    category: 'customer',
    sampleValue: '001928374-0202',
    description: 'NBR VAT registration number for corporate tax invoices',
  },
  {
    key: 'customer_address',
    name: 'Customer Address',
    nameBangla: 'গ্রাহকের ঠিকানা',
    category: 'customer',
    sampleValue: 'Plot 3, GPHouse, Bashundhara R/A, Dhaka 1229',
    description: 'Full billing or site address in Bangladesh',
  },

  // Order variables
  {
    key: 'work_order_id',
    name: 'Work Order ID',
    nameBangla: 'কাজের আইডি',
    category: 'order',
    sampleValue: 'WO-9045',
    description: 'Unique work order identifier',
  },
  {
    key: 'work_order_title',
    name: 'Work Order Title',
    nameBangla: 'কাজের শিরোনাম',
    category: 'order',
    sampleValue: 'Emergency Transformer Board Diagnostics & Servicing',
    description: 'Title of the service order',
  },
  {
    key: 'priority',
    name: 'Priority Level',
    nameBangla: 'জরুরি মাত্রা',
    category: 'order',
    sampleValue: 'CRITICAL',
    description: 'Priority of work order (CRITICAL / HIGH / MEDIUM / LOW)',
  },
  {
    key: 'sla_deadline',
    name: 'SLA Deadline',
    nameBangla: 'এসএলএ সময়সীমা',
    category: 'order',
    sampleValue: 'Today, 2:30 PM BST',
    description: 'Guaranteed deadline for resolving the work order',
  },
  {
    key: 'scheduled_start_time',
    name: 'Scheduled Start',
    nameBangla: 'নির্ধারিত শুরুর সময়',
    category: 'order',
    sampleValue: 'Today, 11:30 AM BST',
    description: 'Planned arrival and start time',
  },
  {
    key: 'site_address',
    name: 'Site Address',
    nameBangla: 'কাজের স্থান',
    category: 'order',
    sampleValue: 'House 42, Road 11, Banani Block D',
    description: 'Service site address',
  },
  {
    key: 'thana',
    name: 'Thana/Upazila',
    nameBangla: 'থানা/উপজেলা',
    category: 'order',
    sampleValue: 'Banani',
    description: 'Administrative thana in Bangladesh',
  },
  {
    key: 'division',
    name: 'Division',
    nameBangla: 'বিভাগ',
    category: 'order',
    sampleValue: 'Dhaka',
    description: 'Bangladesh division',
  },
  {
    key: 'landmark',
    name: 'Landmark',
    nameBangla: 'নিকটবর্তী স্থান',
    category: 'order',
    sampleValue: 'Opposite to Banani Supermarket & Metrorail Pillar 19',
    description: 'Prominent local landmark for navigation',
  },
  {
    key: 'map_url',
    name: 'Map Navigation URL',
    nameBangla: 'ম্যাপের লিংক',
    category: 'order',
    sampleValue: 'https://maps.google.com/?q=23.7925,90.4078',
    description: 'Direct Google Maps turn-by-turn routing link',
  },
  {
    key: 'job_details_url',
    name: 'Job App URL',
    nameBangla: 'কাজের বিস্তারিত লিংক',
    category: 'order',
    sampleValue: 'https://app.fieldops.bd/jobs/WO-9045',
    description: 'Direct deep-link to the field technician mobile PWA',
  },

  // Technician variables
  {
    key: 'technician_name',
    name: 'Technician Name',
    nameBangla: 'টেকনিশিয়ানের নাম',
    category: 'technician',
    sampleValue: 'Md. Rahim Uddin',
    description: 'Assigned field technician lead',
  },
  {
    key: 'technician_phone',
    name: 'Technician Phone',
    nameBangla: 'টেকনিশিয়ানের ফোন',
    category: 'technician',
    sampleValue: '+880 1711-889922',
    description: 'Phone number of the field technician',
  },

  // Financial variables
  {
    key: 'invoice_number',
    name: 'Invoice Number',
    nameBangla: 'ইনভয়েস নম্বর',
    category: 'financial',
    sampleValue: 'INV-2026-0891',
    description: 'Mushak 6.3 compliant invoice number',
  },
  {
    key: 'receipt_number',
    name: 'Receipt Number',
    nameBangla: 'রসিদ নম্বর',
    category: 'financial',
    sampleValue: 'REC-2026-1044',
    description: 'Official payment receipt identifier',
  },
  {
    key: 'subtotal_amount',
    name: 'Subtotal BDT',
    nameBangla: 'সাবটোটাল (টাকা)',
    category: 'financial',
    sampleValue: '7,391',
    description: 'Subtotal amount before VAT in BDT',
  },
  {
    key: 'vat_amount',
    name: '15% VAT BDT',
    nameBangla: '১৫% ভ্যাট (টাকা)',
    category: 'financial',
    sampleValue: '1,109',
    description: 'NBR standard 15% VAT amount',
  },
  {
    key: 'total_amount',
    name: 'Total Paid BDT',
    nameBangla: 'মোট পরিশোধ (টাকা)',
    category: 'financial',
    sampleValue: '8,500',
    description: 'Total transaction amount including taxes in BDT',
  },
  {
    key: 'grand_total',
    name: 'Grand Total BDT',
    nameBangla: 'সর্বমোট (টাকা)',
    category: 'financial',
    sampleValue: '8,500',
    description: 'Invoice grand total due in BDT',
  },
  {
    key: 'payment_method',
    name: 'Payment Method',
    nameBangla: 'পেমেন্ট মাধ্যম',
    category: 'financial',
    sampleValue: 'bKash Merchant Payment',
    description: 'Payment gateway or channel used (bKash / Nagad / Bank)',
  },
  {
    key: 'transaction_id',
    name: 'Trx ID',
    nameBangla: 'ট্রানজেকশন আইডি',
    category: 'financial',
    sampleValue: 'BK9948X01',
    description: 'Bank or Mobile Financial Service transaction code',
  },

  // Company variables
  {
    key: 'company_name',
    name: 'Company Name',
    nameBangla: 'প্রতিষ্ঠানের নাম',
    category: 'company',
    sampleValue: 'FieldOps Pro Bangladesh Ltd.',
    description: 'Your registered legal company name',
  },
  {
    key: 'company_address',
    name: 'Company Address',
    nameBangla: 'প্রতিষ্ঠানের ঠিকানা',
    category: 'company',
    sampleValue: 'Level 14, Simpletree Anarkali, 89 Gulshan Avenue, Dhaka 1212',
    description: 'Headquarters physical address',
  },
  {
    key: 'company_phone',
    name: 'Hotline Phone',
    nameBangla: 'হটলাইন ফোন',
    category: 'company',
    sampleValue: '+880 9612-445566',
    description: '24/7 NOC Central Support Hotline',
  },

  // System & Invitation variables
  {
    key: 'user_name',
    name: 'User Name',
    nameBangla: 'ব্যবহারকারীর নাম',
    category: 'system',
    sampleValue: 'Tanvir Hossain',
    description: 'Name of the invited staff or system user',
  },
  {
    key: 'inviter_name',
    name: 'Inviter Name',
    nameBangla: 'আমন্ত্রণকারীর নাম',
    category: 'system',
    sampleValue: 'Md. Shafiqul Islam (Super Admin)',
    description: 'Name of the administrator issuing the invite',
  },
  {
    key: 'assigned_role',
    name: 'Assigned Role',
    nameBangla: 'নিযুক্ত পদবি',
    category: 'system',
    sampleValue: 'Operations Dispatcher (অপারেশনস ডিসপ্যাচার)',
    description: 'Assigned RBAC role',
  },
  {
    key: 'temp_password',
    name: 'Temporary Password/PIN',
    nameBangla: 'অস্থায়ী পাসওয়ার্ড',
    category: 'system',
    sampleValue: 'FP-88921-BD',
    description: 'One-time secure login PIN',
  },
  {
    key: 'activation_url',
    name: 'Activation URL',
    nameBangla: 'অ্যাক্টিভেশন লিংক',
    category: 'system',
    sampleValue: 'https://app.fieldops.bd/auth/activate?token=exp_998124',
    description: 'Account activation onboarding link',
  },
];

export function getSampleDataMap(): Record<string, string> {
  const map: Record<string, string> = {
    email_title: 'FieldOps Pro Notification',
    settings_url: 'https://app.fieldops.bd/settings/email',
    help_url: 'https://support.fieldops.bd',
    privacy_url: 'https://fieldops.bd/privacy',
    online_pay_url: 'https://pay.fieldops.bd/invoice/INV-2026-0891',
    receipt_download_url: 'https://app.fieldops.bd/receipts/REC-2026-1044.pdf',
    dispatch_action_url: 'https://app.fieldops.bd/dispatch/live-map',
    service_title: '3-Phase Substation Transformer Servicing & Oil Check',
    issue_date: '04 Oct, 2026',
    due_date: '11 Oct, 2026',
    payment_date: '04 Oct, 2026, 03:45 PM',
    item_title_1: 'Transformer Diagnostic Overhaul & Coil Rectification',
    item_price_1: '7,391',
    subtotal: '7,391',
    vat_total: '1,109',
    sla_target_minutes: '120',
    overdue_minutes: '42',
    current_status: 'IN_PROGRESS',
    site_name: 'Jamuna Future Park Substation Unit 4',
    penalty_risk_bdt: '12,500',
    organization_name: 'Summit Communications Ltd.',
    user_email: 'tanvir@summit.bd',
  };

  TEMPLATE_VARIABLES.forEach((v) => {
    map[v.key] = v.sampleValue;
  });

  return map;
}

/**
 * Replace {{variable_name}} or {variable_name} tags with data
 */
export function injectVariables(template: string, data: Record<string, any>): string {
  if (!template) return '';

  return template.replace(/\{\{?\s*([a-zA-Z0-9_-]+)\s*\}?\}/g, (match, key) => {
    if (key in data && data[key] !== undefined && data[key] !== null) {
      return String(data[key]);
    }
    return match;
  });
}

/**
 * Wrap inner content within the responsive base layout
 */
export function renderTemplate(
  bodyHtml: string,
  variables: Record<string, any> = {},
  title: string = 'FieldOps Pro Email'
): string {
  const mergedData: Record<string, any> = { ...getSampleDataMap(), ...variables, email_title: title };
  const processedBody = injectVariables(bodyHtml, mergedData);

  // If already a full HTML document, just inject variables
  if (processedBody.includes('<html') || processedBody.includes('<!DOCTYPE')) {
    return injectVariables(processedBody, mergedData);
  }

  // Otherwise, wrap in base HTML frame
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 32px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .header {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
      padding: 24px 32px;
      color: #ffffff;
      text-align: left;
    }
    .brand-title {
      font-size: 19px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .brand-sub {
      font-size: 11px;
      color: #c7d2fe;
      margin-top: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 24px 32px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.6;
    }
    .footer a {
      color: #4f46e5;
      text-decoration: none;
    }
    .footer-divider {
      margin: 12px auto;
      width: 40px;
      height: 2px;
      background-color: #cbd5e1;
      border: none;
    }
    .btn-primary {
      display: inline-block;
      background: #4f46e5;
      color: #ffffff !important;
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <table width="100%" border="0" cellpadding="0" cellspacing="0">
          <tr>
            <td>
              <div class="brand-title">⚡ FieldOps Pro Bangladesh</div>
              <div class="brand-sub">Dhaka Central Operations & NOC Dispatch</div>
            </td>
            <td align="right">
              <span style="font-size: 11px; color: #a5b4fc; background: rgba(255,255,255,0.12); padding: 4px 8px; border-radius: 6px; font-weight: 600;">
                Verified Business
              </span>
            </td>
          </tr>
        </table>
      </div>

      <div class="content">
        ${processedBody}
      </div>

      <div class="footer">
        <p style="margin: 0 0 4px 0; font-weight: 600; color: #334155;">FieldOps Pro Enterprise FSM Bangladesh</p>
        <p style="margin: 0 0 4px 0;">Level 14, Simpletree Anarkali, 89 Gulshan Avenue, Gulshan-2, Dhaka 1212</p>
        <p style="margin: 0 0 10px 0;">BIN: 002391084-0101 | 24/7 NOC Hotline: +880 9612-445566</p>
        <hr class="footer-divider" />
        <p style="margin: 0; font-size: 11px;">
          You received this email because your company account is registered on FieldOps Pro.
          <br>
          <a href="${mergedData.settings_url || '#'}">Notification Preferences</a> • <a href="${mergedData.help_url || '#'}">Help Desk</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
