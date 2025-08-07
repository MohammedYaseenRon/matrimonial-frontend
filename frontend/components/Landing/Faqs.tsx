import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const faqs = [
  {
    id: 1,
    question: "How does the matching algorithm work?",
    answer: "Our AI-powered algorithm analyzes your preferences, interests, values, and lifestyle to find compatible matches. It considers factors like age range, location, education, family background, and personal values to suggest the most suitable profiles."
  },
  {
    id: 2,
    question: "Is my profile information secure and private?",
    answer: "Absolutely! We use end-to-end encryption for all communications and have strict privacy controls. You can choose who sees your profile, photos, and contact information. We never share your data with third parties without your consent."
  },
  {
    id: 3,
    question: "How are profiles verified on your platform?",
    answer: "Every profile goes through a multi-step verification process including photo verification, phone number confirmation, and document validation. We also have a dedicated team that manually reviews profiles to ensure authenticity."
  },
  {
    id: 4,
    question: "What's the difference between free and premium membership?",
    answer: "Free members can create profiles, browse matches, and send limited messages. Premium members get unlimited messaging, advanced search filters, profile boost features, read receipts, and priority customer support."
  },
  {
    id: 5,
    question: "Can I connect with people from other countries?",
    answer: "Yes! We have members from 190+ countries. You can set your location preferences to find matches locally or globally. Our platform supports multiple languages and cultural preferences."
  },
  {
    id: 6,
    question: "How do I report suspicious or fake profiles?",
    answer: "We take safety seriously. You can report any suspicious activity or fake profiles directly from their profile page. Our security team investigates all reports within 24 hours and takes appropriate action."
  }
];

export default function FAQs() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <View className="bg-white px-6 py-20">
      <View className="max-w-4xl mx-auto">
        {/* Header Section */}
        <View className="items-center mb-16">
          <View className="flex-row items-center mb-4 border border-emerald-200 rounded-xl p-2 bg-white/70">
            <View className="w-6 h-0.5 bg-emerald-500 mr-3"></View>
            <Text className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">
              FAQ
            </Text>
          </View>
          
          <Text className="text-6xl font-black text-center mb-8 leading-tight">
            <Text className="text-gray-800">Frequently Asked</Text>{'\n'}
            <Text className="text-emerald-600">Questions</Text>
          </Text>
          
          <Text className="text-gray-700 text-center text-lg leading-relaxed max-w-3xl">
            Got questions? We've got answers! Find everything you need to know 
            about our platform and services.
          </Text>
        </View>

        {/* FAQ Items */}
        <View className="space-y-4">
          {faqs.map((faq) => (
            <View key={faq.id} className="bg-white/80 backdrop-blur-sm border border-emerald-100 rounded-2xl shadow-lg overflow-hidden">
              <TouchableOpacity
                onPress={() => toggleFAQ(faq.id)}
                className="p-6 flex-row items-center justify-between"
              >
                <Text className="text-lg font-bold text-gray-800 flex-1 pr-4">
                  {faq.question}
                </Text>
                <View className={`transform transition-transform duration-200 ${expandedFAQ === faq.id ? 'rotate-180' : ''}`}>
                  <Feather 
                    name="chevron-down" 
                    size={24} 
                    color={expandedFAQ === faq.id ? "#10b981" : "#6b7280"} 
                  />
                </View>
              </TouchableOpacity>
              
              {expandedFAQ === faq.id && (
                <View className="px-6 pb-6">
                  <View className="border-t border-emerald-100 pt-4">
                    <Text className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support */}
        <View className="items-center mt-12">
          <Text className="text-gray-600 text-center mb-4">
            Still have questions? We're here to help!
          </Text>
          <TouchableOpacity className="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3 rounded-full shadow-xl">
            <Text className="text-white font-bold">
              Contact Support
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
