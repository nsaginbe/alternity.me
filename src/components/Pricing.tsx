import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Star, Sparkles, Crown, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Pricing() {
  const { t } = useTranslation();
  const plans = [
    {
      name: t('pricing.plans.free.name'),
      price: '$0',
      period: t('pricing.plans.free.period'),
      description: t('pricing.plans.free.description'),
      features: [
        t('pricing.plans.free.feature1'),
        t('pricing.plans.free.feature2'),
        t('pricing.plans.free.feature3'),
        t('pricing.plans.free.feature4')
      ],
      icon: <Star className="w-6 h-6" />,
      buttonText: t('pricing.plans.free.buttonText'),
      buttonVariant: 'outline' as const,
      popular: false
    },
    {
      name: t('pricing.plans.pro.name'),
      price: '$9.99',
      period: t('pricing.plans.pro.period'),
      description: t('pricing.plans.pro.description'),
      features: [
        t('pricing.plans.pro.feature1'),
        t('pricing.plans.pro.feature2'),
        t('pricing.plans.pro.feature3'),
        t('pricing.plans.pro.feature4'),
        t('pricing.plans.pro.feature5'),
        t('pricing.plans.pro.feature6')
      ],
      icon: <Sparkles className="w-6 h-6" />,
      buttonText: t('pricing.plans.pro.buttonText'),
      buttonVariant: 'default' as const,
      popular: true
    },
    {
      name: t('pricing.plans.premium.name'),
      price: '$19.99',
      period: t('pricing.plans.premium.period'),
      description: t('pricing.plans.premium.description'),
      features: [
        t('pricing.plans.premium.feature1'),
        t('pricing.plans.premium.feature2'),
        t('pricing.plans.premium.feature3'),
        t('pricing.plans.premium.feature4'),
        t('pricing.plans.premium.feature5'),
        t('pricing.plans.premium.feature6')
      ],
      icon: <Crown className="w-6 h-6" />,
      buttonText: t('pricing.plans.premium.buttonText'),
      buttonVariant: 'default' as const,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 pt-32">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('pricing.choosePlan')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.unlockPower')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative hover:shadow-xl transition-all duration-300 ${
                plan.popular 
                  ? 'border-2 border-purple-500 scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    {t('pricing.mostPopular')}
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  variant={plan.buttonVariant}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' 
                      : ''
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('pricing.faq')}
            </h2>
            <p className="text-gray-600">
              {t('pricing.faqDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('pricing.cancelAnytime.q')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('pricing.cancelAnytime.a')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('pricing.paymentMethods.q')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('pricing.paymentMethods.a')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('pricing.dataSecure.q')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('pricing.dataSecure.a')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {t('pricing.refunds.q')}
              </h3>
              <p className="text-gray-600 text-sm">
                {t('pricing.refunds.a')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 