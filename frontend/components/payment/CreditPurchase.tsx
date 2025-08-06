import { apiClient } from '@/utils/AuthClient';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Only import RazorpayCheckout for mobile platforms
let RazorpayCheckout: any = null;
if (Platform.OS !== 'web') {
  try {
    RazorpayCheckout = require('react-native-razorpay').default;
  } catch (error) {
    console.warn('Razorpay not available for this platform');
  }
}

interface CreditPackage {
  id: string;
  name: string;
  price: number;
  credits: number;
  bonusCredits: number;
  features: string[];
  popular: boolean;
}

interface CreditPurchaseProps {
  section: 'matrimonial' | 'social';
  userEmail: string;
  userMobile: string;
}

const CreditPurchase: React.FC<CreditPurchaseProps> = ({ 
  section, 
  userEmail, 
  userMobile
}) => {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    loadCreditPackages();
    loadCurrentBalance();
    
    // Load Razorpay script for web
    if (Platform.OS === 'web') {
      loadRazorpayScript();
    }
  }, [section]);

  const loadRazorpayScript = () => {
    if (typeof window !== 'undefined' && !(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  };

  const loadCreditPackages = async () => {
    try {
      const response = await apiClient.get('/payments/packages');
      if (response.success && response.data) {
        setPackages(response.data.packages || response.data);
      }
    } catch (error) {
      console.error('Failed to load packages:', error);
    }
  };

  const loadCurrentBalance = async () => {
    try {
      const response = await apiClient.get(`/payments/balance/${section}`);
      if (response.success && response.data) {
        setCurrentBalance(parseFloat(response.data.credits || response.data));
      }
    } catch (error) {
      console.error('Failed to load balance:', error);
    }
  };

  const initiatePayment = async (packageData: CreditPackage) => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      // 1. Create Razorpay order
      const orderResponse = await apiClient.post('/payments/create-order', {
        section,
        amount: packageData.price,
        packageType: packageData.id
      });

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error('Failed to create order');
      }

      const order = orderResponse.data;

      // 2. Initialize Razorpay checkout based on platform
      if (Platform.OS === 'web') {
        await handleWebPayment(order);
      } else {
        await handleMobilePayment(order);
      }

    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  const handleWebPayment = async (order: any) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: section === 'matrimonial' ? 'Matrimonial Platform' : 'Social Platform',
        description: `${order.creditPackage.name} - ${order.creditPackage.totalCredits} credits`,
        order_id: order.orderId,
        handler: async (response: any) => {
          try {
            await handlePaymentSuccess(response);
            resolve(response);
          } catch (error) {
            reject(error);
          }
        },
        prefill: {
          email: userEmail,
          contact: userMobile
        },
        theme: {
          color: section === 'matrimonial' ? '#d63384' : '#0d6efd'
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            reject(new Error('Payment cancelled'));
          }
        }
      };

      if ((window as any).Razorpay) {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error('Razorpay not loaded');
      }
    });
  };

  const handleMobilePayment = async (order: any) => {
    return new Promise((resolve, reject) => {
      if (!RazorpayCheckout) {
        reject(new Error('Razorpay not available on this platform'));
        return;
      }

      const options = {
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: section === 'matrimonial' ? 'Matrimonial Platform' : 'Social Platform',
        description: `${order.creditPackage.name} - ${order.creditPackage.totalCredits} credits`,
        order_id: order.orderId,
        prefill: {
          email: userEmail,
          contact: userMobile
        },
        theme: {
          color: section === 'matrimonial' ? '#d63384' : '#0d6efd'
        }
      };

      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          try {
            await handlePaymentSuccess(data);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        })
        .catch((error: any) => {
          console.error('Mobile payment error:', error);
          setLoading(false);
          reject(error);
        });
    });
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      const verifyResponse = await apiClient.post('/payments/verify-payment', {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature
      });
      
      if (verifyResponse.success && verifyResponse.data) {
        alert(`Success! ${verifyResponse.data.creditsAdded || 'Credits'} added to your ${section} account.`);
        await loadCurrentBalance(); // Refresh balance
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      alert('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.creditPurchase}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.currentBalance}>
        <Text style={styles.balanceTitle}>
          Current {section === 'matrimonial' ? 'Matrimonial' : 'Social'} Credits: ₹{currentBalance}
        </Text>
      </View>

      <View style={styles.packagesContainer}>
        {packages.map((pkg) => (
          <View key={pkg.id} style={[styles.packageCard, pkg.popular && styles.popularCard]}>
            {pkg.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>Most Popular</Text>
              </View>
            )}
            <Text style={styles.packageName}>{pkg.name}</Text>
            <Text style={styles.price}>₹{pkg.price}</Text>
            <View style={styles.creditsContainer}>
              <Text style={styles.credits}>{pkg.credits} Credits</Text>
              {pkg.bonusCredits > 0 && (
                <Text style={styles.bonus}>+ {pkg.bonusCredits} Bonus</Text>
              )}
            </View>
            <View style={styles.features}>
              {pkg.features.map((feature, index) => (
                <Text key={index} style={styles.featureItem}>• {feature}</Text>
              ))}
            </View>
            <TouchableOpacity 
              onPress={() => initiatePayment(pkg)}
              disabled={loading}
              style={[
                styles.purchaseBtn, 
                loading && styles.purchaseBtnDisabled,
                Platform.OS === 'web' && styles.webButton,
                Platform.OS === 'web' && loading && { cursor: 'not-allowed' as any }
              ]}
            >
              <Text style={styles.purchaseBtnText}>
                {loading ? 'Processing...' : 'Purchase Credits'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.pricingInfo}>
        <Text style={styles.pricingTitle}>Credit Usage ({section} section):</Text>
        <View style={styles.pricingList}>
          <Text style={styles.pricingItem}>• <Text style={styles.bold}>Second Search:</Text> ₹2 (20 results + 5 free messages)</Text>
          <Text style={styles.pricingItem}>• <Text style={styles.bold}>Custom Message:</Text> ₹1 (after template messages)</Text>
          <Text style={styles.pricingItem}>• <Text style={styles.bold}>Read Receipt:</Text> ₹1 (check if message was read)</Text>
          <Text style={styles.pricingItem}>• <Text style={styles.bold}>Nudge:</Text> ₹1 (highlight unread messages)</Text>
          {section === 'matrimonial' && (
            <Text style={styles.pricingItem}>• <Text style={styles.bold}>Legacy Additional Search:</Text> ₹3 (pre-2026 users)</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  creditPurchase: {
    ...((Platform.OS === 'web')
      ? { minHeight: '100vh' as any, backgroundColor: '#f5f5f5', padding: 16 }
      : { flex: 1, backgroundColor: '#f5f5f5', padding: 16 }),
  },
  webContainer: {
    height: '100vh' as any,
    overflow: 'auto' as any,
    paddingBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  currentBalance: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  packagesContainer: {
    flex: 1,
  },
  packageCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  popularCard: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 12,
  },
  creditsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  credits: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  bonus: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  features: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  purchaseBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  webButton: {
    cursor: 'pointer',
  },
  purchaseBtnDisabled: {
    backgroundColor: '#ccc',
  },
  purchaseBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pricingInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }),
  },
  pricingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  pricingList: {
    paddingLeft: 8,
  },
  pricingItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default CreditPurchase;