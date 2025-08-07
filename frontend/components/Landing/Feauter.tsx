import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const features = [
    {
        icon: 'shield',
        title: 'Verified Profiles',
        description: 'Every profile is manually verified for authenticity and safety',
        color: 'purple'
    },
    {
        icon: 'heart',
        title: 'Smart Matching',
        description: 'AI-powered algorithm finds your perfect compatibility match',
        color: 'pink'
    },
    {
        icon: 'video',
        title: 'Video Chat',
        description: 'Connect face-to-face with secure video calling features',
        color: 'blue'
    },
    {
        icon: 'lock',
        title: 'Privacy First',
        description: 'End-to-end encryption keeps your conversations private',
        color: 'green'
    },
    {
        icon: 'globe',
        title: 'Global Reach',
        description: 'Connect with people from 190+ countries worldwide',
        color: 'orange'
    },
    {
        icon: 'headphones',
        title: '24/7 Support',
        description: 'Round-the-clock customer support for all your needs',
        color: 'indigo'
    }
];

const getColorClasses = (color: string) => {
    const colorMap = {
        purple: { bg: 'bg-purple-100', icon: '#8b5cf6', border: 'border-purple-200' },
        pink: { bg: 'bg-pink-100', icon: '#ec4899', border: 'border-pink-200' },
        blue: { bg: 'bg-blue-100', icon: '#3b82f6', border: 'border-blue-200' },
        green: { bg: 'bg-emerald-100', icon: '#10b981', border: 'border-emerald-200' },
        orange: { bg: 'bg-orange-100', icon: '#f59e0b', border: 'border-orange-200' },
        indigo: { bg: 'bg-indigo-100', icon: '#6366f1', border: 'border-indigo-200' }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
};

export default function Features() {
    return (
        <View className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-6 py-20">
            <View className="max-w-6xl mx-auto">
                {/* Header Section */}
                <View className="items-center mb-16">
                    <View className="flex-row items-center mb-4 border border-blue-200 rounded-xl p-2 bg-white/70">
                        <View className="w-6 h-0.5 bg-blue-500 mr-3"></View>
                        <Text className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
                            Our Features
                        </Text>
                    </View>

                    <Text className="text-6xl font-black text-center mb-8 leading-tight">
                        <Text className="text-gray-800">Why Choose</Text>{'\n'}
                        <Text className="text-blue-600">ConnectApp?</Text>
                    </Text>

                    <Text className="text-gray-700 text-center text-lg leading-relaxed max-w-4xl">
                        Discover the powerful features that make us the most trusted platform
                        for finding love and meaningful connections.
                    </Text>
                </View>

                {/* Features Grid */}
                <View className="flex-row justify-between space-x-8">
                    {/* First column */}
                    <View className="flex-1">
                        {features.slice(0, 3).map((feature, index) => {
                            const colors = getColorClasses(feature.color);
                            return (
                                <View key={index} className="mb-8">
                                    <View className={`${colors.border} border bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg`} style={{ height: 200 }}>
                                        <View className={`${colors.bg} p-4 rounded-2xl mb-4 self-start`}>
                                            <Feather name={feature.icon as any} size={24} color={colors.icon} />
                                        </View>
                                        <Text className="text-xl font-bold text-gray-800 mb-3">
                                            {feature.title}
                                        </Text>
                                        <Text className="text-gray-600 leading-relaxed text-sm flex-1">
                                            {feature.description}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* Second column */}
                    <View className="flex-1">
                        {features.slice(3, 6).map((feature, index) => {
                            const colors = getColorClasses(feature.color);
                            return (
                                <View key={index} className="mb-8">
                                    <View className={`${colors.border} border bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg`} style={{ height: 200 }}>
                                        <View className={`${colors.bg} p-4 rounded-2xl mb-4 self-start`}>
                                            <Feather name={feature.icon as any} size={24} color={colors.icon} />
                                        </View>
                                        <Text className="text-xl font-bold text-gray-800 mb-3">
                                            {feature.title}
                                        </Text>
                                        <Text className="text-gray-600 leading-relaxed text-sm flex-1">
                                            {feature.description}
                                        </Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>


                {/* CTA Section */}
                <View className="items-center mt-12">
                    <TouchableOpacity className="bg-gradient-to-r from-blue-600 to-purple-600 px-12 py-4 rounded-full shadow-xl">
                        <Text className="text-white font-bold text-lg">
                            Explore All Features
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
