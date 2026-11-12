import React, { useState, useMemo } from 'react';
import {
  X,
  CreditCard,
  Banknote,
  QrCode,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  User,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { translations } from '../../utils/i18n';

export default function PaymentModal({
  orderData,
  onClose,
  onConfirmOrder,
  currency = '₹',
  language = 'en'
}) {
  const t = (key) => translations[language]?.[key] || translations.en[key] || key;
  const [paymentMethod, setPaymentMethod] = useState('CASH'); // CASH, UPI, CARD, DUE
  const [cashTendered, setCashTendered] = useState(orderData.grandTotal);
  const [cardRef, setCardRef] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const grandTotal = Number(orderData.grandTotal) || 0;

  // Change computation for Cash
  const changeDue = useMemo(() => {
    if (paymentMethod === 'CASH') {
      const tendered = Number(cashTendered) || 0;
      return tendered >= grandTotal ? tendered - grandTotal : 0;
    }
    return 0;
  }, [cashTendered, grandTotal, paymentMethod]);

  // Remaining due computation if payment method is DUE or Partial Cash
  const remainingDue = useMemo(() => {
    if (paymentMethod === 'DUE') {
      const paid = Number(cashTendered) || 0;
      return Math.max(0, grandTotal - paid);
    }
    return 0;
  }, [paymentMethod, cashTendered, grandTotal]);

  const handleQuickCash = (amount) => {
    setCashTendered(amount);
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);

    try {
      // Fire confetti celebration!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      const finalOrder = {
        ...orderData,
        paymentMethod,
        amountPaid: paymentMethod === 'DUE' ? Number(cashTendered) || 0 : grandTotal,
        changeReturned: changeDue,
        dueAmount: remainingDue,
        paymentStatus: remainingDue > 0 ? (cashTendered > 0 ? 'PARTIALLY_PAID' : 'UNPAID') : 'PAID',
        notes: notes.trim()
      };

      await onConfirmOrder(finalOrder);
    } catch (err) {
      console.error(err);
      alert('Error finalizing sale. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quick cash suggestion denominations
  const quickCashOptions = [
    grandTotal,
    Math.ceil(grandTotal / 100) * 100,
    Math.ceil(grandTotal / 500) * 500,
    2000
  ].filter((v, i, a) => a.indexOf(v) === i && v >= grandTotal);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/80 text-white">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">{t('completeCheckout')}</h3>
              <p className="text-xs text-indigo-200">
                {language === 'hi' ? 'बिल की कुल राशि: ' : 'Invoice Total: '}
                {currency}{grandTotal.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Customer Detail Banner */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span className="text-slate-500">{language === 'hi' ? 'ग्राहक: ' : 'Customer: '}</span>
              <strong className="text-slate-800">
                {orderData.customer?.name || t('walkInCustomer')}
              </strong>
            </div>
            <div className="text-slate-500">
              {orderData.customer?.phone ? `📞 ${orderData.customer.phone}` : (language === 'hi' ? 'सीधी बिक्री' : 'Direct Sale')}
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wide">
              {t('selectPaymentMethod')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'CASH', label: t('cash'), icon: Banknote },
                { id: 'UPI', label: t('upiQr'), icon: QrCode },
                { id: 'CARD', label: t('card'), icon: CreditCard },
                { id: 'DUE', label: t('creditDue'), icon: Clock }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = paymentMethod === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(tab.id);
                      if (tab.id === 'DUE') setCashTendered(0);
                      else setCashTendered(grandTotal);
                    }}
                    className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center gap-1.5 transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-extrabold shadow-xs ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Specific Content */}
          {paymentMethod === 'CASH' && (
            <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">{t('cashReceived')}:</span>
                <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-slate-300 font-extrabold text-slate-800 text-sm">
                  <span>{currency}</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-24 text-right focus:outline-none"
                    autoFocus
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-500">{language === 'hi' ? 'त्वरित: ' : 'Quick: '}</span>
                {quickCashOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleQuickCash(opt)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-white hover:bg-slate-100 text-emerald-800 border border-emerald-300 transition"
                  >
                    {currency}{opt.toFixed(0)}
                  </button>
                ))}
              </div>

              {/* Change calculation */}
              <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">{t('changeToReturn')}:</span>
                <span className="text-lg font-black text-emerald-700">
                  {currency}{changeDue.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'UPI' && (
            <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-200 flex items-center gap-4">
              {/* Dynamic QR Code */}
              <div className="w-28 h-28 bg-white p-2 rounded-xl shadow-xs border border-indigo-200 flex-shrink-0 flex items-center justify-center">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=billing@smartbiz&pn=smartBiz&am=${grandTotal.toFixed(2)}&cu=INR`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs space-y-1">
                <span className="font-extrabold text-indigo-950 block text-sm">
                  {t('scanAndPayUpi')}
                </span>
                <p className="text-slate-600 text-[11px]">
                  {language === 'hi' ? 'Google Pay, PhonePe, Paytm, BHIM या किसी भी UPI ऐप से स्कैन करें।' : 'Compatible with Google Pay, PhonePe, Paytm, BHIM or any UPI banking app.'}
                </p>
                <div className="font-bold text-indigo-700 pt-1">
                  VPA: <span className="underline">billing@smartbiz</span>
                </div>
                <div className="text-[11px] font-bold text-slate-700">
                  {language === 'hi' ? 'कुल देय: ' : 'Payable: '}{currency}{grandTotal.toFixed(2)}
                </div>
              </div>
            </div>
          )}

          {paymentMethod === 'CARD' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <label className="block font-bold text-slate-700">
                {language === 'hi' ? 'कार्ड / स्वाइप मशीन संदर्भ संख्या (वैकल्पिक):' : 'Card / POS Approval Reference Code (Optional):'}
              </label>
              <input
                type="text"
                placeholder={language === 'hi' ? 'उदा. TXN98721345 या Auth Code' : 'e.g. TXN98721345 or Auth Code'}
                value={cardRef}
                onChange={(e) => setCardRef(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <p className="text-[11px] text-slate-500">
                {language === 'hi' ? 'दुकान की कार्ड मशीन पर कार्ड स्वाइप करें और रसीद नंबर दर्ज करें।' : 'Swipe/Tap card on physical EDC terminal and enter the reference number.'}
              </p>
            </div>
          )}

          {paymentMethod === 'DUE' && (
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>{language === 'hi' ? 'उधार बिक्री / ग्राहक खाता (Khata)' : 'Credit Sale / Customer Ledger (Khata)'}</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {language === 'hi' ? 'यह बिल ग्राहक के बही-खाते (उधार लेजर) में दर्ज कर दिया जाएगा।' : "This bill amount will be added to the customer's pending due ledger."}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-semibold text-slate-700">{language === 'hi' ? 'अभी प्राप्त अग्रिम राशि (Deposit):' : 'Amount Paid Now (Deposit):'}</span>
                <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-slate-300 font-bold">
                  <span>{currency}</span>
                  <input
                    type="number"
                    min="0"
                    max={grandTotal}
                    value={cashTendered}
                    onChange={(e) => setCashTendered(e.target.value)}
                    className="w-20 text-right focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-amber-200 flex items-center justify-between font-bold text-amber-900">
                <span>{language === 'hi' ? 'खाते में बकाया दर्ज:' : 'Remaining Due Recorded:'}</span>
                <span className="text-base text-red-600">{currency}{remainingDue.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Optional Order Note */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              {language === 'hi' ? 'बिल टिप्पणी / नोट (वैकल्पिक):' : 'Order Note / Remarks (Optional):'}
            </label>
            <input
              type="text"
              placeholder={language === 'hi' ? 'उदा. काउंटर बिक्री, डिस्काउंट स्वीकृत' : 'e.g. Counter sale, Gift wrap requested'}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            {language === 'hi' ? 'वापस जाएं' : 'Back to Cart'}
          </button>

          <button
            type="button"
            onClick={handleCompleteOrder}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-lg transition flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('completeAndPrint')} ({currency}{grandTotal.toFixed(2)})</span>
          </button>
        </div>
      </div>
    </div>
  );
}

