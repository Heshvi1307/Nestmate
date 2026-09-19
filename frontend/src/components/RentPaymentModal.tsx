import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  CreditCard, 
  IndianRupee, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  QrCode,
  Building,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RentPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  amount: number;
  unit: string;
  landlordName: string;
}

export const RentPaymentModal: React.FC<RentPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  amount = 24000,
  unit = 'Flat 402, The Solitaire Terraces, Vastrapur',
  landlordName = 'Vikramaditya Sanghavi'
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'autopay'>('upi');
  const [upiId, setUpiId] = useState('hetpatel@okhdfcbank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onPaymentSuccess();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-surface rounded-3xl shadow-dropdown border border-border overflow-hidden my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-text-primary tracking-tight">
                NestMate Digital Rent Settlement
              </h2>
              <span className="text-[11px] text-text-muted">
                0% Convenience Fee · Direct Verified Escrow
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-surfaceMuted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isSuccess ? (
          <div className="p-6 space-y-6 text-xs">
            
            {/* Amount Callout */}
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-border flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
                  Amount Due (September 2026)
                </span>
                <span className="text-2xl font-black text-primary tabular-nums">
                  ₹{amount.toLocaleString('en-IN')}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                Verified Owner Escrow
              </span>
            </div>

            {/* Recipient info */}
            <div className="p-3.5 rounded-xl bg-surfaceMuted/50 border border-border space-y-1">
              <div className="flex justify-between">
                <span className="text-text-muted">Payee (Verified Landlord):</span>
                <span className="font-bold text-text-primary">{landlordName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Premises:</span>
                <span className="font-semibold text-text-primary truncate max-w-xs">{unit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Transaction Fee:</span>
                <span className="font-bold text-success">₹0 (Zero Fee)</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="block font-bold text-text-primary uppercase tracking-wider text-[11px]">
                Select Payment Mode
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    paymentMethod === 'upi'
                      ? 'bg-primary-light border-primary text-primary shadow-subtle'
                      : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                  }`}
                >
                  <span className="block">Instant UPI</span>
                  <span className="text-[10px] font-normal text-text-muted">GPay / PhonePe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    paymentMethod === 'netbanking'
                      ? 'bg-primary-light border-primary text-primary shadow-subtle'
                      : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                  }`}
                >
                  <span className="block">NetBanking</span>
                  <span className="text-[10px] font-normal text-text-muted">HDFC / ICICI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('autopay')}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    paymentMethod === 'autopay'
                      ? 'bg-primary-light border-primary text-primary shadow-subtle'
                      : 'bg-surface border-border text-text-secondary hover:bg-surfaceMuted'
                  }`}
                >
                  <span className="block">e-Mandate</span>
                  <span className="text-[10px] font-normal text-text-muted">Auto-pay 1st</span>
                </button>
              </div>
            </div>

            {/* UPI ID input */}
            {paymentMethod === 'upi' && (
              <div className="space-y-1">
                <label className="block font-bold text-text-primary">Your UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>
            )}

            {/* Simulated CTA */}
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-xs font-black shadow-card transition-all flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <span>Authorizing UPI Mandate...</span>
              ) : (
                <>
                  <span>Simulate Payment of ₹{amount.toLocaleString('en-IN')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-center text-[10px] text-text-muted">
              Demo Mode: Simulates instant digital bank clearance and generates official HRA tax rent receipt.
            </div>

          </div>
        ) : (
          /* Payment Success & Receipt View */
          <div className="p-7 text-center space-y-5 text-xs">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-elevated">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-text-primary">
                Rent Cleared Successfully!
              </h3>
              <p className="text-text-secondary">
                ₹{amount.toLocaleString('en-IN')} has been transferred to {landlordName}.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 rounded-2xl bg-[#FAFBF9] border border-border text-left space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between font-bold border-b border-border pb-2">
                <span>HRA Digital Rent Receipt</span>
                <span className="text-primary">#NMR-2026-SEP-402</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Payment Date:</span>
                <span className="text-text-primary font-semibold">Today (Instant)</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Payment Reference:</span>
                <span className="text-text-primary font-mono text-[10px]">UPI/HDFC/62894192031</span>
              </div>
              <div className="flex justify-between text-text-muted">
                <span>Landlord PAN:</span>
                <span className="text-text-primary font-mono text-[10px]">AAAPS7892K (Verified)</span>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  alert('Receipt #NMR-2026-SEP-402 downloaded (PDF ready for HRA submission).');
                }}
                className="px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surfaceMuted font-bold text-xs flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download HRA Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-primary text-white font-extrabold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
