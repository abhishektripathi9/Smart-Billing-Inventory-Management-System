import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  Shield,
  Zap,
  Clock,
  CreditCard,
  Building2,
  HardDrive,
  Users,
  Smartphone,
  ChevronRight,
  Headphones
} from 'lucide-react';

export default function Subscription({
  currency = '₹',
  language = 'en'
}) {
  const trialDaysLeft = 112; // Matching reference screenshot!

  const plans = [
    {
      name: 'smartBiz Basic',
      price: 'Free',
      period: 'Forever',
      description: 'Ideal for small single-counter retail shops and kirana stores.',
      features: [
        'Single Billing Counter',
        'Up to 500 Products',
        '80mm Thermal Receipts',
        'Offline LocalStorage Sync',
        'Basic Daily Sales Report'
      ],
      current: false,
      cta: 'Downgrade to Basic'
    },
    {
      name: 'smartBiz PRO Enterprise',
      price: '₹1,499',
      period: 'per year',
      description: 'Complete multi-counter POS, Indian GST compliance and inventory tracking.',
      features: [
        'Multi-Counter POS Terminals',
        'Unlimited Products & Categories',
        'Dual Invoices (80mm Thermal + A4 GST)',
        'Automatic CGST / SGST / IGST Engine',
        'EAN-13 Barcode Sticker Generator',
        'Customer Khata & WhatsApp Due Reminders',
        'Day-End Cash Drawer Z-Report Audit',
        'PWA Mobile & Desktop Standalone Apps',
        '24/7 Priority Support & Cloud Backup'
      ],
      current: true,
      popular: true,
      cta: 'Renew / Extend Enterprise Plan'
    },
    {
      name: 'Multi-Store Chain / Franchise',
      price: '₹3,999',
      period: 'per year',
      description: 'Designed for supermarkets and multi-branch retail chains.',
      features: [
        'Up to 10 Store Branches',
        'Centralized Warehouse Stock Transfer',
        'Inter-Store Inventory Sync',
        'Custom B2B e-Way Bill Export',
        'Dedicated Account Manager'
      ],
      current: false,
      cta: 'Upgrade to Franchise'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-slate-100 space-y-6">
      {/* Top Banner with "Your Trial Expires in 112 days" matching screenshot */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-950 p-6 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'स्मार्टबिज़ प्रो सक्रिय' : 'smartBiz PRO Active'}</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {language === 'hi' ? `आपका ट्रायल ${trialDaysLeft} दिनों में समाप्त होगा` : `Your Trial Expires in ${trialDaysLeft} days`}
            </h1>
            <p className="text-xs text-indigo-200 max-w-xl">
              {language === 'hi' ? 'आपके पास सभी प्रो फीचर्स सक्रिय हैं: जीएसटी इनवॉइसिंग, बारकोड लेबलिंग, उधार खाता और असीमित बिक्री काउंटर।' : 'You have full access to all enterprise features: dual printable invoices, GST calculations, barcode sticker generator, and multi-counter terminals.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => alert('smartBiz Enterprise license is currently active and valid!')}
              className="px-6 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-slate-900 font-extrabold text-xs rounded-xl shadow-lg transition"
            >
              {language === 'hi' ? 'प्लान रीन्यू करें' : 'Renew / Upgrade Plan'}
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`bg-white rounded-3xl border p-6 flex flex-col justify-between shadow-xs transition-all duration-200 ${
              plan.popular
                ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 relative'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full shadow-md">
                Active Plan
              </span>
            )}

            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{plan.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{plan.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900">{plan.price}</span>
                <span className="text-xs text-slate-500 font-medium">/{plan.period}</span>
              </div>

              <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100">
              <button
                onClick={() => alert(`Selected plan: ${plan.name}`)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition ${
                  plan.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise SLA & Cloud Security Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-5 rounded-2xl border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800">Bank-Grade AES Security</div>
            <div className="text-[11px] text-slate-400">Encrypted local and cloud sync</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800">99.99% Uptime SLA</div>
            <div className="text-[11px] text-slate-400">Offline-first local POS resilience</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-slate-800">24/7 Dedicated Support</div>
            <div className="text-[11px] text-slate-400">Instant counter assistance</div>
          </div>
        </div>
      </div>
    </div>
  );
}

