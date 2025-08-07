import React from "react";
import { Text, View } from "react-native";



export default function Faq() {
  const faqs = [
    {
      question: "Is {process.env.EXPO_PUBLIC_PROJECT_NAME} free to use?",
      answer: "Yes! Basic features are free. Premium features available with subscription."
    },
    {
      question: "How do you ensure user safety?",
      answer: "We use profile verification, secure messaging, and have strict community guidelines."
    },
    {
      question: "Can I use both social and matrimonial features?",
      answer: "Absolutely! You can explore both sections based on what you're looking for."
    }
  ];

  return (
    <View className="px-6 py-12">
      <Text className="text-2xl font-bold text-center mb-8 text-gray-800">
        Frequently Asked Questions
      </Text>
      
      {faqs.map((faq, index) => (
        <View key={index} className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-3">{faq.question}</Text>
          <Text className="text-gray-600 leading-6">{faq.answer}</Text>
        </View>
      ))}
    </View>
  );
}
