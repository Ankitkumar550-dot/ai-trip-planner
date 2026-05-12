import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const tiers = [
  {
    name: 'Free',
    price: '0',
    features: ['5 Trip Plans / month', 'Standard AI Model', 'Community Support'],
    buttonText: 'Get Started',
    popular: false,
    path: '/create-new-trip'
  },
  {
    name: 'Pro',
    price: '9.99',
    features: ['Unlimited Trip Plans', 'Advanced AI Models', 'Priority Support', 'Offline Access'],
    buttonText: 'Go Pro',
    popular: true,
  },
  {
    name: 'Premium',
    price: '19.99',
    features: ['Everything in Pro', 'Personal Travel Concierge', 'Exclusive Deals', 'Custom Themes'],
    buttonText: 'Go Premium',
    popular: false,
  },
];

function Pricing() {
  const navigate = useNavigate();

  const handlePlanSelect = (tier) => {
    if (tier.path) {
      navigate(tier.path);
    } else {
      alert(`The ${tier.name} plan is coming soon! Stay tuned for our premium features.`);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-black text-white">
      <div className="max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Choose Your Plan</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Unlock the full potential of AI-powered trip planning with our flexible pricing options.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`relative bg-neutral-900 rounded-[2.5rem] p-8 shadow-xl border-2 transition-all hover:scale-[1.02] flex flex-col ${
                tier.popular ? 'border-indigo-500 scale-105 z-10' : 'border-white/5'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                  Most Popular
                </div>
              )}

              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-gray-400 text-sm">/month</span>
                </div>
              </div>

              <div className="flex-grow space-y-4 mb-8">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-left">
                    <div className="bg-green-500/10 p-1 rounded-full">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <span className="text-gray-400 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handlePlanSelect(tier)}
                className={`w-full h-12 rounded-xl font-bold transition-all ${
                  tier.popular
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-white'
                }`}
              >
                {tier.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
