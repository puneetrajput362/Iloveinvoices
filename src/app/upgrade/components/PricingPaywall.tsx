'use client';
import React, { useState } from 'react';
import { Zap, Check, Star, Shield, Clock, Headphones, Crown, ArrowRight, X,  } from 'lucide-react';
import { toast } from 'sonner';
import Icon from '@/components/ui/AppIcon';


type BillingCycle = 'monthly' | 'annual' | 'lifetime';

const plans = [
  {
    id: 'plan-free',
    key: 'free' as const,
    name: 'Free',
    badge: null,
    price: '₹0',
    period: '/ month',
    subtext: 'Forever free',
    color: 'border-border',
    headerBg: 'bg-muted/40',
    ctaClass: 'btn-ghost',
    ctaLabel: 'Current Plan',
    ctaDisabled: true,
    features: [
      { id: 'f-free-1', text: '10 invoice scans / month', included: true },
      { id: 'f-free-2', text: '2 PDF scans / month', included: true },
      { id: 'f-free-3', text: 'Manual verification', included: true },
      { id: 'f-free-4', text: 'CSV export', included: true },
      { id: 'f-free-5', text: 'GST Excel export', included: false },
      { id: 'f-free-6', text: 'Tally XML export', included: false },
      { id: 'f-free-7', text: 'Bulk upload', included: false },
      { id: 'f-free-8', text: 'Priority support', included: false },
    ],
  },
  {
    id: 'plan-monthly',
    key: 'monthly' as const,
    name: 'Monthly',
    badge: null,
    price: '₹199',
    period: '/ month',
    subtext: 'Billed monthly',
    color: 'border-accent/50',
    headerBg: 'bg-accent/10',
    ctaClass: 'btn-accent',
    ctaLabel: 'Start Free Trial',
    ctaDisabled: false,
    features: [
      { id: 'f-mo-1', text: 'Unlimited scans', included: true },
      { id: 'f-mo-2', text: 'Unlimited PDF scans', included: true },
      { id: 'f-mo-3', text: 'AI auto-verification', included: true },
      { id: 'f-mo-4', text: 'CSV export', included: true },
      { id: 'f-mo-5', text: 'GST Excel export', included: true },
      { id: 'f-mo-6', text: 'Tally XML export', included: true },
      { id: 'f-mo-7', text: 'Bulk upload', included: true },
      { id: 'f-mo-8', text: 'Email support', included: true },
    ],
  },
  {
    id: 'plan-annual',
    key: 'annual' as const,
    name: 'Annual',
    badge: 'BEST VALUE · SAVE 60%',
    price: '₹83',
    period: '/ month',
    subtext: 'Billed ₹999/year',
    color: 'border-primary',
    headerBg: 'gradient-primary',
    ctaClass: 'btn-primary',
    ctaLabel: 'Start 3-Day Free Trial',
    ctaDisabled: false,
    features: [
      { id: 'f-an-1', text: 'Unlimited scans', included: true },
      { id: 'f-an-2', text: 'Unlimited PDF scans', included: true },
      { id: 'f-an-3', text: 'AI auto-verification', included: true },
      { id: 'f-an-4', text: 'CSV export', included: true },
      { id: 'f-an-5', text: 'GST Excel export', included: true },
      { id: 'f-an-6', text: 'Tally XML export', included: true },
      { id: 'f-an-7', text: 'Bulk upload (50 at once)', included: true },
      { id: 'f-an-8', text: 'Priority WhatsApp support', included: true },
    ],
  },
  {
    id: 'plan-lifetime',
    key: 'lifetime' as const,
    name: 'Lifetime',
    badge: 'LIMITED BATCH',
    price: '₹1,999',
    period: 'one-time',
    subtext: 'Pay once, use forever',
    color: 'border-warning/50',
    headerBg: 'bg-warning/10',
    ctaClass: 'btn-primary',
    ctaLabel: 'Get Lifetime Access',
    ctaDisabled: false,
    features: [
      { id: 'f-lt-1', text: 'Everything in Annual', included: true },
      { id: 'f-lt-2', text: 'Lifetime updates', included: true },
      { id: 'f-lt-3', text: 'Early access to new features', included: true },
      { id: 'f-lt-4', text: 'Dedicated onboarding call', included: true },
      { id: 'f-lt-5', text: 'Custom GSTIN rules', included: true },
      { id: 'f-lt-6', text: 'API access (coming soon)', included: true },
      { id: 'f-lt-7', text: 'White-label export', included: true },
      { id: 'f-lt-8', text: '1:1 Tally setup support', included: true },
    ],
  },
];

const trustBadges = [
  { id: 'trust-secure', icon: Shield, label: 'Razorpay Secured' },
  { id: 'trust-trial', icon: Clock, label: '3-Day Free Trial' },
  { id: 'trust-cancel', icon: X, label: 'Cancel Anytime' },
  { id: 'trust-support', icon: Headphones, label: 'WhatsApp Support' },
];

const testimonials = [
  {
    id: 'review-001',
    name: 'Rajesh Agarwal',
    role: 'CA, Mumbai',
    text: 'Saves me 3+ hours every GST filing day. The Tally export is flawless.',
    rating: 5,
  },
  {
    id: 'review-002',
    name: 'Priya Nair',
    role: 'Textile shop owner, Surat',
    text: 'My accountant loves the Excel file. No more manual entry mistakes!',
    rating: 5,
  },
  {
    id: 'review-003',
    name: 'Vikram Sharma',
    role: 'Wholesale distributor, Delhi',
    text: 'Scanned 200 invoices in one afternoon. Lifetime deal was a no-brainer.',
    rating: 5,
  },
];

export default function PricingPaywall() {
  const [selectedPlan, setSelectedPlan] = useState<BillingCycle>('annual');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'done'>('method');

  const handleUpgrade = (planKey: string) => {
    if (planKey === 'free') return;
    setSelectedPlan(planKey as BillingCycle);
    setShowPayment(true);
    setPaymentStep('method');
  };

  const handlePayment = async () => {
    setPaymentStep('processing');
    // BACKEND: Initiate Razorpay order via /api/payment/create-order
    await new Promise((r) => setTimeout(r, 2000));
    setPaymentStep('done');
    toast.success('🎉 Welcome to ILoveInvoice Pro!');
  };

  return (
    <div className="px-4 pt-4 pb-8 max-w-screen-2xl mx-auto space-y-6">
      {/* Hero headline */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 mb-1">
          <Zap size={12} className="text-primary" />
          <span className="text-xs font-bold text-primary">Limited Time Offer</span>
        </div>
        <h1 className="text-2xl font-extrabold text-foreground leading-tight">
          Unlock Unlimited Invoice Scans &amp;{' '}
          <span className="text-gradient-primary">Save 10+ Hours</span>{' '}
          Every Week!
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto">
          Join 12,000+ Indian accountants and business owners who file GST stress-free.
        </p>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-4 gap-2">
        {trustBadges.map((b) => {
          const Icon = b.icon;
          return (
            <div
              key={b.id}
              className="flex flex-col items-center gap-1 p-2 rounded-xl bg-muted/30 border border-border"
            >
              <Icon size={16} className="text-primary" />
              <span className="text-2xs font-semibold text-muted-foreground text-center leading-tight">
                {b.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Plan cards */}
      <div className="space-y-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.key && plan.key !== 'free';
          const isAnnual = plan.key === 'annual';
          const isLifetime = plan.key === 'lifetime';

          return (
            <div
              key={plan.id}
              onClick={() => plan.key !== 'free' && setSelectedPlan(plan.key as BillingCycle)}
              className={`card-elevated rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                plan.color
              } ${isSelected ? 'glow-primary scale-[1.01]' : 'hover:scale-[1.005]'}`}
            >
              {/* Plan header */}
              <div className={`px-4 py-3 ${isAnnual ? plan.headerBg : plan.headerBg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-extrabold ${
                        isAnnual ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span
                        className={`text-2xs font-extrabold px-2 py-0.5 rounded-full ${
                          isAnnual
                            ? 'bg-white/20 text-white'
                            : isLifetime
                            ? 'bg-warning/20 text-warning border border-warning/40' :'bg-muted text-muted-foreground'
                        }`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xl font-extrabold font-tabular ${
                        isAnnual ? 'text-white' : 'text-foreground'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs ml-1 ${
                        isAnnual ? 'text-white/70' : 'text-muted-foreground'
                      }`}
                    >
                      {plan.period}
                    </span>
                  </div>
                </div>
                <p
                  className={`text-xs mt-0.5 ${
                    isAnnual ? 'text-white/70' : 'text-muted-foreground'
                  }`}
                >
                  {plan.subtext}
                </p>
              </div>

              {/* Features */}
              <div className="px-4 py-3 space-y-2">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {plan.features.map((feat) => (
                    <div key={feat.id} className="flex items-center gap-1.5">
                      {feat.included ? (
                        <Check size={12} className="text-success flex-shrink-0" />
                      ) : (
                        <X size={12} className="text-muted-foreground/40 flex-shrink-0" />
                      )}
                      <span
                        className={`text-2xs ${
                          feat.included ? 'text-foreground' : 'text-muted-foreground/50 line-through'
                        }`}
                      >
                        {feat.text}
                      </span>
                    </div>
                  ))}
                </div>

                {plan.key !== 'free' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpgrade(plan.key);
                    }}
                    className={`${plan.ctaClass} w-full py-2.5 text-sm mt-2 flex items-center justify-center gap-2`}
                  >
                    {plan.ctaLabel}
                    <ArrowRight size={14} />
                  </button>
                )}
                {plan.key === 'free' && (
                  <div className="w-full py-2.5 text-sm text-center text-muted-foreground font-semibold">
                    ✓ Your current plan
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-foreground">What our users say</h2>
        <div className="space-y-2">
          {testimonials.map((t) => (
            <div key={t.id} className="card-elevated rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: t.rating }, (_, i) => (
                  <Star
                    key={`star-${t.id}-${i + 1}`}
                    size={12}
                    className="text-warning fill-warning"
                  />
                ))}
              </div>
              <p className="text-xs text-foreground leading-relaxed">"{t.text}"</p>
              <div>
                <p className="text-xs font-bold text-foreground">{t.name}</p>
                <p className="text-2xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment modal */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => {
              if (paymentStep !== 'processing') setShowPayment(false);
            }}
          />
          <div className="relative w-full max-w-md card-elevated rounded-t-3xl animate-fade-in-up p-5 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-border mx-auto" />

            {paymentStep === 'method' && (
              <>
                <div className="text-center">
                  <Crown size={28} className="text-primary mx-auto mb-2" />
                  <h3 className="text-base font-extrabold text-foreground">
                    Complete Your Upgrade
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {selectedPlan === 'annual' ?'₹999/year — 3-day free trial, cancel anytime'
                      : selectedPlan === 'monthly' ?'₹199/month — cancel anytime' :'₹1,999 one-time — lifetime access'}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Choose Payment Method
                  </p>

                  {/* UPI */}
                  <button
                    onClick={handlePayment}
                    className="w-full p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <span className="text-xs font-extrabold text-primary">UPI</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-foreground">
                        UPI / PhonePe / GPay
                      </p>
                      <p className="text-2xs text-muted-foreground">
                        Instant · No card needed
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground ml-auto" />
                  </button>

                  {/* Card */}
                  <button
                    onClick={handlePayment}
                    className="w-full p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
                      <span className="text-xs font-extrabold text-accent">CARD</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-foreground">
                        Debit / Credit Card
                      </p>
                      <p className="text-2xs text-muted-foreground">
                        Visa, Mastercard, RuPay
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground ml-auto" />
                  </button>

                  {/* Net banking */}
                  <button
                    onClick={handlePayment}
                    className="w-full p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-warning/15 flex items-center justify-center">
                      <span className="text-xs font-extrabold text-warning">NET</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-foreground">Net Banking</p>
                      <p className="text-2xs text-muted-foreground">All major banks</p>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground ml-auto" />
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 pt-1">
                  <Shield size={12} className="text-muted-foreground" />
                  <p className="text-2xs text-muted-foreground">
                    Secured by Razorpay · 256-bit SSL encryption
                  </p>
                </div>
              </>
            )}

            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center animate-pulse-glow">
                  <svg className="animate-spin w-8 h-8 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">Processing Payment</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please do not close this window
                  </p>
                </div>
              </div>
            )}

            {paymentStep === 'done' && (
              <div className="flex flex-col items-center justify-center py-8 gap-4">
                <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                  <Check size={32} className="text-success" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-foreground">
                    🎉 Welcome to Pro!
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your plan is now active. Enjoy unlimited scans!
                  </p>
                </div>
                <button
                  onClick={() => setShowPayment(false)}
                  className="btn-primary px-8 py-2.5 text-sm"
                >
                  Start Scanning
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom fine print */}
      <p className="text-2xs text-muted-foreground text-center pb-2">
        By upgrading, you agree to our Terms of Service and Privacy Policy.
        Prices inclusive of 18% GST. Cancel or pause anytime from account settings.
      </p>
    </div>
  );
}