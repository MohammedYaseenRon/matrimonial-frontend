import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, Dimensions } from 'react-native';

const testimonials = [
    {
        id: 1,
        name: "Sarah & Michael",
        location: "London, UK",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        text: "The platform's features made it easy to find someone who truly understood me. We're planning our wedding next month!",
        status: "Engaged",
        statusColor: "bg-pink-100",
        statusTextColor: "text-pink-600"
    },
    {
        id: 2,
        name: "Fatima & Omar",
        location: "Dubai, UAE",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        text: "Amazing experience! The privacy features and genuine profiles helped us build trust from day one. Highly recommended!",
        status: "Dating 1 year",
        statusColor: "bg-blue-100",
        statusTextColor: "text-blue-600"
    },
    {
        id: 3,
        name: "Emily & James",
        location: "New York, USA",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        text: "The verification process gave us confidence in meeting genuine people. We're grateful for this platform bringing us together!",
        status: "Married 1 year ago",
        statusColor: "bg-green-100",
        statusTextColor: "text-green-600"
    },
    {
        id: 4,
        name: "Aisha & Hassan",
        location: "Karachi, Pakistan",
        avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        text: "The cultural matching feature was perfect for us. We found someone who shares our values and dreams. Thank you!",
        status: "Engaged",
        statusColor: "bg-purple-100",
        statusTextColor: "text-purple-600"
    },
    {
        id: 5,
        name: "Lisa & David",
        location: "Sydney, Australia",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
        rating: 5,
        text: "After trying many platforms, this one was different. Real connections, genuine people, and excellent support throughout!",
        status: "Recently Married",
        statusColor: "bg-orange-100",
        statusTextColor: "text-orange-600"
    }
];

const { width: screenWidth } = Dimensions.get('window');

export default function TestimonialSection() {
    const scrollViewRef = useRef<ScrollView>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const cardWidth = 320; // Card width
        const gap = 20; // Gap between cards
        const totalCardWidth = cardWidth + gap;
        const totalWidth = testimonials.length * totalCardWidth;

        let currentPosition = 0;

        const startAnimation = () => {
            const animation = Animated.loop(
                Animated.timing(scrollX, {
                    toValue: totalWidth,
                    duration: testimonials.length * 3000, // 3 seconds per card
                    useNativeDriver: false,
                }),
                { iterations: -1 }
            );

            // Listen to animation values to update scroll position
            const listener = scrollX.addListener(({ value }) => {
                currentPosition = value % totalWidth;
                scrollViewRef.current?.scrollTo({
                    x: currentPosition,
                    animated: false,
                });
            });

            animation.start();

            return () => {
                animation.stop();
                scrollX.removeListener(listener);
            };
        };

        const cleanup = startAnimation();
        return cleanup;
    }, []);

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Text
                key={index}
                className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            >
                ★
            </Text>
        ));
    };

    const TestimonialCard = ({ testimonial }: { testimonial: any }) => (
        <View
            className="bg-white rounded-2xl p-6 shadow-md mx-3"
            style={{ width: 280, minHeight: 320 }}
        >
            {/* Header */}
            <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 rounded-full mr-4 overflow-hidden bg-pink-500 items-center justify-center">
                    {/* If no image, show initials */}
                    <Text className="text-white font-bold text-sm">
                        {testimonial.name.split(' ')[0][0]}
                        {testimonial.name.split(' ')[1] ? testimonial.name.split(' ')[1][0] : ''}
                    </Text>
                </View>

                <View className="flex-1">
                    <Text className="font-semibold text-gray-900 text-base">
                        {testimonial.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">{testimonial.location}</Text>

                    <View
                        className={`px-2 py-0.5 mt-1 rounded-full ${testimonial.statusBg}`}
                    >
                        <Text className={`text-xs font-semibold ${testimonial.statusText}`}>
                            {testimonial.status}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Star Rating */}
            <View className="flex-row items-center mb-3">
                {renderStars(testimonial.rating)}
            </View>

            {/* Testimonial Quote */}
            <Text className="text-gray-700 text-sm leading-relaxed">
                "{testimonial.text}"
            </Text>
        </View>
    );


    return (
        <View className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-20">
            <View className="max-w-5xl mx-auto px-6">
                {/* Header Section */}
                <View className="items-center mb-16">
                    <View className="flex-row items-center mb-6 bg-white/70 border border-purple-200 rounded-full px-4 py-2">
                        <View className="w-6 h-0.5 bg-purple-500 mr-3" />
                        <Text className="text-purple-600 font-semibold text-sm uppercase tracking-wider">
                            Success Stories
                        </Text>
                    </View>

                    <Text className="text-5xl md:text-6xl font-black text-gray-900 mb-6 text-center leading-tight">
                        Love Stories That Inspire
                    </Text>

                    <Text className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl">
                        Real couples, real stories. Discover how our platform has helped
                        thousands find their perfect match.
                    </Text>
                </View>

                {/* Testimonials Carousel */}
                <View className="overflow-hidden">
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        scrollEventThrottle={16}
                        snapToInterval={340} // Card width + gap
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                        }}
                    >
                        {/* Triple the testimonials for infinite scroll */}
                        {[...testimonials, ...testimonials, ...testimonials].map((testimonial, index) => (
                            <TestimonialCard
                                key={`${testimonial.id}-${Math.floor(index / testimonials.length)}`}
                                testimonial={testimonial}
                            />
                        ))}
                    </ScrollView>
                </View>

                {/* Stats Section */}
                <View className="flex-row justify-center items-center mt-16">
                    <View className="items-center">
                        <Text className="text-4xl font-black text-purple-600 mb-2">98%</Text>
                        <Text className="text-gray-600 font-medium">Success Rate</Text>
                    </View>
                    <View className="w-px h-16 bg-gray-300 mx-12" />
                    <View className="items-center">
                        <Text className="text-4xl font-black text-purple-600 mb-2">500K+</Text>
                        <Text className="text-gray-600 font-medium">Happy Couples</Text>
                    </View>
                    <View className="w-px h-16 bg-gray-300 mx-12" />
                    <View className="items-center">
                        <Text className="text-4xl font-black text-purple-600 mb-2">4.9★</Text>
                        <Text className="text-gray-600 font-medium">Average Rating</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}
