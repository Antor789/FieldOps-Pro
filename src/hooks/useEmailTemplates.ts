import { useState, useCallback } from 'react';
import { EmailTemplate, EmailTemplateType } from '../types/email';
import { renderTemplate } from '../utils/emailRenderer';

export const INITIAL_EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'wo_assigned',
    name: 'Work Order Assigned to Technician',
    nameBangla: 'টেকনিশিয়ানকে নতুন কাজ অর্পণ',
    category: 'operations',
    description: 'Triggered when a work order is dispatched to a field technician lead.',
    triggerEvent: 'work_order.dispatched',
    recipientRoles: ['technician'],
    subject: 'New Job Assigned: #{{work_order_id}} - {{work_order_title}}',
    subjectBangla: 'নতুন কাজের দায়িত্ব: #{{work_order_id}} - {{work_order_title}}',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-02T10:15:00Z'),
    variables: [
      'technician_name',
      'work_order_id',
      'work_order_title',
      'priority',
      'sla_deadline',
      'customer_name',
      'customer_phone',
      'site_address',
      'thana',
      'division',
      'landmark',
      'scheduled_start_time',
      'map_url',
      'job_details_url',
    ],
    bodyHtml: `<div style="font-size: 15px; line-height: 1.6; color: #1e293b;">
  <div style="background-color: #e0e7ff; color: #3730a3; padding: 6px 12px; border-radius: 6px; display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">
    Work Order Assigned / নতুন কাজের দায়িত্ব অর্পণ
  </div>
  <h2 style="margin: 0 0 8px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
    Hello {{technician_name}},
  </h2>
  <p style="margin: 0 0 20px 0; color: #475569;">
    A new service job <strong>#{{work_order_id}}</strong> has been assigned to you by the Dhaka dispatch team. Please review the customer details and travel timeline below.
  </p>
  <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
    <tr>
      <td width="35%" style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600;">Job Title:</td>
      <td style="border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px; font-weight: 700;">{{work_order_title}}</td>
    </tr>
    <tr>
      <td style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600;">Priority & SLA:</td>
      <td style="border-bottom: 1px solid #e2e8f0;">
        <span style="background-color: #fee2e2; color: #991b1b; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700;">
          {{priority}}
        </span>
        <span style="font-size: 12px; color: #64748b; margin-left: 8px;">Target: {{sla_deadline}}</span>
      </td>
    </tr>
    <tr>
      <td style="border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 13px; font-weight: 600;">Customer:</td>
      <td style="border-bottom: 1px solid #e2e8f0; color: #0f172a; font-size: 14px;">
        <strong>{{customer_name}}</strong> (📞 {{customer_phone}})
      </td>
    </tr>
    <tr>
      <td style="color: #64748b; font-size: 13px; font-weight: 600;">Location & Landmark:</td>
      <td style="color: #0f172a; font-size: 13px;">
        📍 {{site_address}}, {{thana}}, {{division}}<br>
        <span style="color: #64748b; font-size: 12px;">Landmark: {{landmark}}</span>
      </td>
    </tr>
  </table>
  <div style="text-align: center; margin: 28px 0;">
    <a href="{{job_details_url}}" class="btn-primary" style="display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      View Job in Field App / কাজের বিস্তারিত দেখুন →
    </a>
  </div>
</div>`,
    bodyText: `Hello {{technician_name}},\n\nA new service job #{{work_order_id}} ({{work_order_title}}) has been assigned to you.\nPriority: {{priority}} (SLA: {{sla_deadline}})\nCustomer: {{customer_name}} ({{customer_phone}})\nLocation: {{site_address}}, {{thana}}, {{division}}\n\nOpen details: {{job_details_url}}`,
  },
  {
    id: 'wo_completed',
    name: 'Work Order Completed Notification',
    nameBangla: 'কাজ সম্পন্ন হওয়ার বিজ্ঞপ্তি',
    category: 'operations',
    description: 'Sent to customer and operations managers once work order is digitally signed off.',
    triggerEvent: 'work_order.completed',
    recipientRoles: ['customer', 'manager'],
    subject: 'Service Completed: WO #{{work_order_id}} - {{work_order_title}}',
    subjectBangla: 'সেবা সম্পন্ন হয়েছে: কাজ #{{work_order_id}}',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-01T14:30:00Z'),
    variables: [
      'customer_name',
      'work_order_id',
      'work_order_title',
      'technician_name',
      'total_amount',
      'receipt_number',
      'receipt_download_url',
    ],
    bodyHtml: `<div style="font-size: 15px; line-height: 1.6; color: #1e293b;">
  <div style="background-color: #dcfce7; color: #166534; padding: 6px 12px; border-radius: 6px; display: inline-block; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px;">
    Service Completed / সেবা সফলভাবে সম্পন্ন
  </div>
  <h2 style="margin: 0 0 8px 0; color: #0f172a; font-size: 20px; font-weight: 700;">
    Dear {{customer_name}},
  </h2>
  <p style="margin: 0 0 20px 0; color: #475569;">
    Your scheduled maintenance job <strong>#{{work_order_id}}</strong> has been successfully resolved and signed off by lead technician <strong>{{technician_name}}</strong>.
  </p>
  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
    <div style="font-size: 13px; color: #64748b;">Total Service Charge:</div>
    <div style="font-size: 22px; font-weight: 800; color: #0f172a;">৳{{total_amount}} BDT</div>
    <div style="font-size: 12px; color: #16a34a; font-weight: 600; margin-top: 4px;">Receipt: {{receipt_number}} (Digital Proof of Work Logged)</div>
  </div>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{receipt_download_url}}" class="btn-primary" style="display: inline-block; background: #059669; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      Download Service Report & VAT Receipt (PDF) →
    </a>
  </div>
</div>`,
    bodyText: `Dear {{customer_name}},\n\nYour service job #{{work_order_id}} has been completed by {{technician_name}}.\nTotal amount: ৳{{total_amount}} BDT (Receipt #{{receipt_number}})\nDownload receipt: {{receipt_download_url}}`,
  },
  {
    id: 'payment_receipt',
    name: 'Payment Receipt (bKash / Nagad / Bank)',
    nameBangla: 'পেমেন্ট রসিদ (বিকাশ / নগদ / ব্যাংক)',
    category: 'finance',
    description: 'NBR Mushak 6.3 compliant payment receipt sent immediately upon funds confirmation.',
    triggerEvent: 'payment.received',
    recipientRoles: ['customer', 'accountant'],
    subject: 'Payment Receipt ৳{{total_amount}} BDT - Receipt #{{receipt_number}}',
    subjectBangla: 'পেমেন্ট রসিদ ৳{{total_amount}} টাকা - রসিদ #{{receipt_number}}',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-03T09:20:00Z'),
    variables: [
      'customer_name',
      'receipt_number',
      'transaction_id',
      'work_order_id',
      'service_title',
      'subtotal_amount',
      'vat_amount',
      'total_amount',
      'payment_method',
      'receipt_download_url',
    ],
    bodyHtml: `<div style="font-size: 15px; line-height: 1.6; color: #1e293b;">
  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
    <tr>
      <td>
        <span style="background-color: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
          Payment Confirmed / অর্থ পরিশোধিত
        </span>
        <h2 style="margin: 8px 0 0 0; color: #0f172a; font-size: 22px; font-weight: 800;">
          Receipt #{{receipt_number}}
        </h2>
      </td>
      <td align="right">
        <div style="font-size: 12px; color: #64748b;">Trx ID: <strong style="color: #0f172a;">{{transaction_id}}</strong></div>
      </td>
    </tr>
  </table>
  <p style="color: #475569; margin-bottom: 24px;">
    Dear <strong>{{customer_name}}</strong>, we have received your payment for Work Order <strong>#{{work_order_id}}</strong> via <strong>{{payment_method}}</strong>.
  </p>
  <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 24px; border-collapse: collapse;">
    <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
      <th>Service</th>
      <th align="right">Subtotal</th>
      <th align="right">15% VAT</th>
      <th align="right">Total</th>
    </tr>
    <tr style="font-size: 13px;">
      <td style="padding: 12px 10px;">{{service_title}}</td>
      <td align="right">৳{{subtotal_amount}}</td>
      <td align="right" style="color: #0284c7;">৳{{vat_amount}}</td>
      <td align="right" style="font-weight: 800; color: #16a34a;">৳{{total_amount}} BDT</td>
    </tr>
  </table>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{receipt_download_url}}" class="btn-primary" style="display: inline-block; background: #059669; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      Download Official NBR Receipt PDF →
    </a>
  </div>
</div>`,
    bodyText: `Dear {{customer_name}},\n\nPayment received: ৳{{total_amount}} BDT for WO #{{work_order_id}} via {{payment_method}} (Trx ID: {{transaction_id}}).\nReceipt #{{receipt_number}}.\nDownload: {{receipt_download_url}}`,
  },
  {
    id: 'invoice',
    name: 'Tax Invoice Delivery (NBR Mushak 6.3)',
    nameBangla: 'কর চালানপত্র (মুশক ৬.৩)',
    category: 'finance',
    description: 'Formal corporate invoice with BIN/TIN breakdown and payment gateway links.',
    triggerEvent: 'invoice.generated',
    recipientRoles: ['customer', 'accountant'],
    subject: 'Tax Invoice {{invoice_number}} - {{company_name}} (৳{{grand_total}} BDT)',
    subjectBangla: 'কর চালানপত্র {{invoice_number}} - ৳{{grand_total}} টাকা',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-02T16:00:00Z'),
    variables: [
      'invoice_number',
      'customer_name',
      'customer_address',
      'customer_bin',
      'work_order_id',
      'subtotal',
      'vat_total',
      'grand_total',
      'online_pay_url',
    ],
    bodyHtml: `<div style="font-size: 14px; line-height: 1.6; color: #1e293b;">
  <h2 style="color: #1e1b4b; font-size: 20px; font-weight: 800; margin: 0 0 4px 0;">TAX INVOICE / কর চালানপত্র</h2>
  <div style="font-size: 12px; color: #64748b; margin-bottom: 20px;">NBR Mushak 6.3 • BIN: 002391084-0101</div>
  <p>Dear <strong>{{customer_name}}</strong>, invoice <strong>#{{invoice_number}}</strong> has been generated for Work Order #{{work_order_id}}.</p>
  <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #cbd5e1; border-radius: 8px; margin: 18px 0; border-collapse: collapse;">
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
      <td>Subtotal:</td>
      <td align="right" style="font-weight: 600;">৳{{subtotal}} BDT</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0; font-size: 12px;">
      <td>NBR 15% Standard VAT:</td>
      <td align="right" style="font-weight: 600; color: #0284c7;">৳{{vat_total}} BDT</td>
    </tr>
    <tr style="font-size: 15px; background-color: #f8fafc;">
      <td style="font-weight: 700;">Grand Total Due:</td>
      <td align="right" style="font-weight: 800; color: #1e1b4b;">৳{{grand_total}} BDT</td>
    </tr>
  </table>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{online_pay_url}}" class="btn-primary" style="display: inline-block; background: #e11d48; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      Pay Online via bKash / Card (৳{{grand_total}} BDT) →
    </a>
  </div>
</div>`,
    bodyText: `Dear {{customer_name}},\n\nTax Invoice #{{invoice_number}} is ready.\nGrand Total: ৳{{grand_total}} BDT (Includes 15% VAT).\nPay online: {{online_pay_url}}`,
  },
  {
    id: 'sla_breach',
    name: 'SLA Breach Incident Alert',
    nameBangla: 'এসএলএ চুক্তি লঙ্ঘন সতর্কতা',
    category: 'operations',
    description: 'High priority alert dispatched when a job exceeds maximum allowable turnaround time.',
    triggerEvent: 'sla.breached',
    recipientRoles: ['admin', 'manager'],
    subject: '⚠️ CRITICAL SLA BREACH: WO #{{work_order_id}} ({{customer_name}})',
    subjectBangla: '⚠️ জরুরি এসএলএ লঙ্ঘন: কাজ #{{work_order_id}} ({{customer_name}})',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-04T08:00:00Z'),
    variables: [
      'work_order_id',
      'customer_name',
      'sla_deadline',
      'overdue_minutes',
      'technician_name',
      'technician_phone',
      'dispatch_action_url',
    ],
    bodyHtml: `<div style="font-size: 14px; line-height: 1.6; color: #1e293b;">
  <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 12px 16px; margin-bottom: 20px;">
    <strong style="color: #991b1b; font-size: 16px;">CRITICAL SLA BREACH ALERT</strong><br>
    <span style="color: #7f1d1d; font-size: 12px;">Job #{{work_order_id}} has exceeded committed client deadline by {{overdue_minutes}} minutes.</span>
  </div>
  <p>Customer: <strong>{{customer_name}}</strong><br>Assigned Lead: <strong>{{technician_name}}</strong> (📞 {{technician_phone}})</p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{dispatch_action_url}}" class="btn-primary" style="display: inline-block; background: #dc2626; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      View Escalation in Live Dispatch Map →
    </a>
  </div>
</div>`,
    bodyText: `CRITICAL SLA BREACH: WO #{{work_order_id}} for {{customer_name}} is {{overdue_minutes}} mins overdue.\nLead: {{technician_name}} ({{technician_phone}})\nTake action: {{dispatch_action_url}}`,
  },
  {
    id: 'invitation',
    name: 'New User Team Invitation',
    nameBangla: 'নতুন ইউজার দলের আমন্ত্রণ',
    category: 'system',
    description: 'Onboarding invitation email with temporary password and 2FA activation steps.',
    triggerEvent: 'user.invited',
    recipientRoles: ['admin', 'manager', 'technician', 'dispatcher', 'accountant'],
    subject: 'Invitation to join {{organization_name}} on FieldOps Pro',
    subjectBangla: 'ফিল্ডঅপস প্রো-তে {{organization_name}} দলে যোগদানের আমন্ত্রণ',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-02T11:00:00Z'),
    variables: [
      'user_name',
      'inviter_name',
      'organization_name',
      'assigned_role',
      'user_email',
      'temp_password',
      'activation_url',
    ],
    bodyHtml: `<div style="font-size: 15px; line-height: 1.6; color: #1e293b;">
  <h2 style="margin: 0 0 10px 0; color: #0f172a; font-size: 20px; font-weight: 800;">
    Welcome to FieldOps Pro, {{user_name}}!
  </h2>
  <p style="color: #475569;">
    You have been invited by <strong>{{inviter_name}}</strong> to join the <strong>{{organization_name}}</strong> operations workspace.
  </p>
  <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 20px 0;">
    <tr>
      <td width="35%" style="color: #64748b; font-size: 13px;">Role:</td>
      <td style="font-weight: 700; color: #4338ca;">{{assigned_role}}</td>
    </tr>
    <tr>
      <td style="color: #64748b; font-size: 13px;">Temp PIN:</td>
      <td><span style="font-family: monospace; font-size: 15px; font-weight: 700; background: #e2e8f0; padding: 2px 8px; border-radius: 4px;">{{temp_password}}</span></td>
    </tr>
  </table>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{activation_url}}" class="btn-primary" style="display: inline-block; background: #6366f1; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      Accept Invitation & Activate Account →
    </a>
  </div>
</div>`,
    bodyText: `Welcome {{user_name}},\n\nYou are invited to join {{organization_name}} on FieldOps Pro as {{assigned_role}}.\nTemporary PIN: {{temp_password}}\nActivate here: {{activation_url}}`,
  },
  {
    id: 'password_reset',
    name: 'Password Reset & OTP Recovery',
    nameBangla: 'পাসওয়ার্ড পরিবর্তন ও ওটিপি রিকভারি',
    category: 'system',
    description: 'Security token and instructions to securely reset account credentials.',
    triggerEvent: 'auth.password_reset_requested',
    recipientRoles: ['all'],
    subject: 'Password Reset Request for FieldOps Pro (OTP: 882910)',
    subjectBangla: 'ফিল্ডঅপস প্রো পাসওয়ার্ড রিসেট ওয়ান-টাইম পিন (৮৮২৯১০)',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-01T09:00:00Z'),
    variables: ['user_name', 'activation_url'],
    bodyHtml: `<div style="font-size: 15px; line-height: 1.6; color: #1e293b;">
  <h2 style="color: #0f172a; font-size: 20px;">Password Reset Request</h2>
  <p>Hello {{user_name}}, we received a request to reset your FieldOps Pro account password. Use the secure link below to set a new password:</p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{activation_url}}" class="btn-primary" style="display: inline-block; background: #0f172a; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      Reset Password Now →
    </a>
  </div>
  <p style="font-size: 12px; color: #64748b;">If you did not request this change, please contact your company administrator immediately.</p>
</div>`,
    bodyText: `Hello {{user_name}},\n\nReset your password here: {{activation_url}}\nIf you did not request this, please contact support.`,
  },
  {
    id: 'reminder',
    name: 'Job Departure & On-Site Reminder',
    nameBangla: 'কাজে যাত্রার তাগাদা ও রিমাইন্ডার',
    category: 'operations',
    description: 'Automated 30-minute reminder sent to technician before scheduled customer arrival.',
    triggerEvent: 'schedule.departure_reminder',
    recipientRoles: ['technician'],
    subject: 'Departure Reminder: WO #{{work_order_id}} in {{thana}} (Starts in 30 mins)',
    subjectBangla: 'যাত্রার রিমাইন্ডার: কাজ #{{work_order_id}} (৩০ মিনিট বাকি)',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-03T11:00:00Z'),
    variables: ['technician_name', 'work_order_id', 'site_address', 'thana', 'landmark', 'job_details_url'],
    bodyHtml: `<div style="font-size: 15px; line-height: 1.6; color: #1e293b;">
  <h2 style="color: #0f172a; font-size: 18px;">Upcoming Job Reminder (30 Mins)</h2>
  <p>Hi {{technician_name}}, you are scheduled to arrive at <strong>{{site_address}}, {{thana}}</strong> in 30 minutes.</p>
  <p style="color: #64748b; font-size: 13px;">Landmark: {{landmark}}</p>
  <div style="text-align: center; margin: 20px 0;">
    <a href="{{job_details_url}}" class="btn-primary" style="display: inline-block; background: #0284c7; color: #ffffff !important; padding: 10px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px;">
      Launch Google Maps Navigation →
    </a>
  </div>
</div>`,
    bodyText: `Reminder for {{technician_name}}: WO #{{work_order_id}} starts in 30 mins at {{site_address}}, {{thana}}.\nDetails: {{job_details_url}}`,
  },
  {
    id: 'feedback_request',
    name: 'Customer Service Rating & CSAT Survey',
    nameBangla: 'গ্রাহক মতামত ও রেটিং জরিপ',
    category: 'customer',
    description: 'Post-service CSAT survey with 5-star rating for quality and SLA feedback.',
    triggerEvent: 'work_order.feedback_solicited',
    recipientRoles: ['customer'],
    subject: 'How was your service with FieldOps Pro? (WO #{{work_order_id}})',
    subjectBangla: 'আমাদের সেবা কেমন লেগেছে? (কাজ #{{work_order_id}})',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-02T18:00:00Z'),
    variables: ['customer_name', 'work_order_id', 'technician_name', 'job_details_url'],
    bodyHtml: `<div style="font-size: 15px; line-height: 1.6; color: #1e293b; text-align: center;">
  <h2 style="color: #0f172a; font-size: 20px;">Rate Your Experience with {{technician_name}}</h2>
  <p style="color: #475569;">Dear {{customer_name}}, thank you for choosing FieldOps Pro. Please take 30 seconds to rate your recent service for WO #{{work_order_id}}.</p>
  <div style="font-size: 32px; margin: 20px 0;">⭐⭐⭐⭐⭐</div>
  <a href="{{job_details_url}}?feedback=true" class="btn-primary" style="display: inline-block; background: #4f46e5; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
    Submit 1-Minute Feedback →
  </a>
</div>`,
    bodyText: `Dear {{customer_name}},\n\nPlease rate your service experience with {{technician_name}} for WO #{{work_order_id}}:\n{{job_details_url}}?feedback=true`,
  },
  {
    id: 'daily_report',
    name: 'Daily Operations Executive Digest',
    nameBangla: 'দৈনিক অপারেশনাল সারাংশ রিপোর্ট',
    category: 'operations',
    description: 'Nightly automated summary of jobs completed, revenue collected, and SLA compliance.',
    triggerEvent: 'cron.daily_digest',
    recipientRoles: ['admin', 'manager'],
    subject: 'Daily Operations Digest: 14 Jobs Completed (৳142,500 Revenue)',
    subjectBangla: 'দৈনিক অপারেশন রিপোর্ট: ১৪টি কাজ সম্পন্ন (৳১,৪২,৫০০ আয়)',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-04T00:00:00Z'),
    variables: ['company_name', 'settings_url'],
    bodyHtml: `<div style="font-size: 14px; line-height: 1.6; color: #1e293b;">
  <h2 style="color: #0f172a; font-size: 18px;">Daily NOC Operations Summary</h2>
  <p>Here is the automated 24-hour recap for {{company_name}} across Dhaka, Chittagong, and Sylhet:</p>
  <table width="100%" cellpadding="10" cellspacing="0" style="border: 1px solid #e2e8f0; border-radius: 8px; margin: 18px 0;">
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td>Completed Work Orders:</td>
      <td align="right" style="font-weight: 700; color: #16a34a;">14</td>
    </tr>
    <tr style="border-bottom: 1px solid #e2e8f0;">
      <td>Total Revenue Collected:</td>
      <td align="right" style="font-weight: 700; color: #0f172a;">৳142,500 BDT</td>
    </tr>
    <tr>
      <td>SLA Compliance Rate:</td>
      <td align="right" style="font-weight: 700; color: #4338ca;">96.8%</td>
    </tr>
  </table>
  <div style="text-align: center; margin: 20px 0;">
    <a href="{{settings_url}}" class="btn-primary" style="display: inline-block; background: #1e1b4b; color: #ffffff !important; padding: 10px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px;">
      View Complete Analytics Dashboard →
    </a>
  </div>
</div>`,
    bodyText: `Daily Operations Digest for {{company_name}}:\n14 Jobs Completed\n৳142,500 BDT Revenue\n96.8% SLA Compliance.`,
  },
  {
    id: 'inventory_alert',
    name: 'Low Van / Warehouse Inventory Alert',
    nameBangla: 'যন্ত্রাংশের ঘাটতি ও ইনভেন্টরি সতর্কতা',
    category: 'operations',
    description: 'Triggered when essential parts (e.g. capacitors, optical couplers) fall below reorder thresholds.',
    triggerEvent: 'inventory.reorder_level_reached',
    recipientRoles: ['manager', 'admin'],
    subject: '⚠️ Low Stock Alert: 3 Parts Reached Reorder Threshold',
    subjectBangla: '⚠️ স্টক সতর্কতা: ৩টি যন্ত্রাংশের পরিমাণ সংকটপূর্ণ',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-03T15:00:00Z'),
    variables: ['company_name', 'settings_url'],
    bodyHtml: `<div style="font-size: 14px; line-height: 1.6; color: #1e293b;">
  <div style="background-color: #fef3c7; border-left: 4px solid #d97706; padding: 10px 14px; margin-bottom: 18px;">
    <strong style="color: #92400e;">INVENTORY THRESHOLD BREACH</strong><br>
    <span style="font-size: 12px; color: #b45309;">Central Warehouse (Tejgaon) reported low stock on critical response parts.</span>
  </div>
  <ul>
    <li>Compressor Run Capacitor 45uF: <strong>2 remaining</strong> (Min: 10)</li>
    <li>Fiber Optic SC-UPC Patch Cords 3m: <strong>5 remaining</strong> (Min: 25)</li>
    <li>MCB Double Pole 32A Siemens: <strong>1 remaining</strong> (Min: 8)</li>
  </ul>
  <div style="text-align: center; margin: 20px 0;">
    <a href="{{settings_url}}" class="btn-primary" style="display: inline-block; background: #d97706; color: #ffffff !important; padding: 10px 24px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 13px;">
      Generate Purchase Requisition (PR) →
    </a>
  </div>
</div>`,
    bodyText: `Low Stock Alert in Central Warehouse:\n- Compressor Run Capacitor: 2 remaining\n- Fiber Patch Cords: 5 remaining\n- MCB Double Pole: 1 remaining`,
  },
  {
    id: 'scheduled_report',
    name: 'Scheduled Custom Business Report',
    nameBangla: 'নির্ধারিত কাস্টম ব্যবসায়িক রিপোর্ট',
    category: 'system',
    description: 'Periodic automated delivery of custom exports, financial P&L, or NBR VAT logs.',
    triggerEvent: 'reports.scheduled_export',
    recipientRoles: ['admin', 'accountant'],
    subject: 'Your Scheduled Report is Ready: Monthly VAT Summary (Excel & PDF)',
    subjectBangla: 'আপনার নির্ধারিত রিপোর্ট প্রস্তুত: মাসিক ভ্যাট বিবরণী',
    isEnabled: true,
    language: 'both',
    lastModified: new Date('2026-10-04T06:00:00Z'),
    variables: ['company_name', 'receipt_download_url'],
    bodyHtml: `<div style="font-size: 14px; line-height: 1.6; color: #1e293b;">
  <h2 style="color: #0f172a; font-size: 18px;">Scheduled Report Ready for Download</h2>
  <p>The automated Monthly VAT & SLA Performance export for {{company_name}} has completed processing.</p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="{{receipt_download_url}}" class="btn-primary" style="display: inline-block; background: #0f766e; color: #ffffff !important; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 14px;">
      Download Report Package (ZIP / Excel) →
    </a>
  </div>
</div>`,
    bodyText: `Your scheduled report for {{company_name}} is ready.\nDownload: {{receipt_download_url}}`,
  },
];

export function useEmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(INITIAL_EMAIL_TEMPLATES);

  const getTemplate = useCallback(
    (id: EmailTemplateType) => templates.find((t) => t.id === id),
    [templates]
  );

  const updateTemplate = useCallback(
    async (
      id: EmailTemplateType,
      updates: Partial<Pick<EmailTemplate, 'subject' | 'subjectBangla' | 'bodyHtml' | 'bodyText' | 'language'>>
    ): Promise<boolean> => {
      setTemplates((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            return {
              ...t,
              ...updates,
              lastModified: new Date(),
            };
          }
          return t;
        })
      );
      return true;
    },
    []
  );

  const toggleTemplate = useCallback(async (id: EmailTemplateType): Promise<boolean> => {
    let nextState = false;
    setTemplates((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          nextState = !t.isEnabled;
          return {
            ...t,
            isEnabled: !t.isEnabled,
            lastModified: new Date(),
          };
        }
        return t;
      })
    );
    return nextState;
  }, []);

  const previewTemplate = useCallback(
    (id: EmailTemplateType, customData: Record<string, any> = {}): string => {
      const template = templates.find((t) => t.id === id);
      if (!template) return '<p>Template not found</p>';
      return renderTemplate(template.bodyHtml, customData, template.name);
    },
    [templates]
  );

  const resetToDefault = useCallback((id: EmailTemplateType) => {
    const original = INITIAL_EMAIL_TEMPLATES.find((t) => t.id === id);
    if (original) {
      setTemplates((prev) => prev.map((t) => (t.id === id ? { ...original } : t)));
    }
  }, []);

  return {
    templates,
    getTemplate,
    updateTemplate,
    toggleTemplate,
    previewTemplate,
    resetToDefault,
  };
}
