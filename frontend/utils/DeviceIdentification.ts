import AsyncStorage from '@react-native-async-storage/async-storage';
import { randomUUID } from "expo-crypto";
import * as Device from 'expo-device';
import { Platform } from 'react-native';

class DeviceIdentification {
  private static readonly DEVICE_ID_KEY = 'matrimonial_device_id';
  private static readonly INSTALLATION_ID_KEY = 'matrimonial_installation_id';

  /**
   * Generate a random UUID using expo-crypto
   */
  private static generateRandomUUID(): string {
    return randomUUID();
  }

  /**
   * Get native device ID for Android/iOS, fallback to UUID for web
   */
  private static async getNativeDeviceId(): Promise<string> {
    try {
      if (Platform.OS === 'android') {
        // For Android, we'll use a combination of device info to create a stable ID
        const deviceName = Device.deviceName || 'unknown';
        const modelName = Device.modelName || 'unknown';
        const brand = Device.brand || 'unknown';
        const osVersion = Device.osVersion || 'unknown';
        
        // Create a stable ID from device characteristics
        const deviceString = `${brand}_${modelName}_${deviceName}_${osVersion}`;
        // Use a hash-like approach with the device string + a stored random component
        const storedComponent = await AsyncStorage.getItem(`${this.DEVICE_ID_KEY}_component`);
        if (!storedComponent) {
          const newComponent = this.generateRandomUUID();
          await AsyncStorage.setItem(`${this.DEVICE_ID_KEY}_component`, newComponent);
          return `ANDROID_${deviceString}_${newComponent}`.replace(/[^a-zA-Z0-9_]/g, '_');
        }
        return `ANDROID_${deviceString}_${storedComponent}`.replace(/[^a-zA-Z0-9_]/g, '_');
        
      } else if (Platform.OS === 'ios') {
        // For iOS, use device characteristics
        const deviceName = Device.deviceName || 'unknown';
        const modelName = Device.modelName || 'unknown';
        const osVersion = Device.osVersion || 'unknown';
        
        const deviceString = `${modelName}_${deviceName}_${osVersion}`;
        const storedComponent = await AsyncStorage.getItem(`${this.DEVICE_ID_KEY}_component`);
        if (!storedComponent) {
          const newComponent = this.generateRandomUUID();
          await AsyncStorage.setItem(`${this.DEVICE_ID_KEY}_component`, newComponent);
          return `IOS_${deviceString}_${newComponent}`.replace(/[^a-zA-Z0-9_]/g, '_');
        }
        return `IOS_${deviceString}_${storedComponent}`.replace(/[^a-zA-Z0-9_]/g, '_');
        
      } else {
        // For web and other platforms, use random UUID
        return `WEB_${this.generateRandomUUID()}`;
      }
    } catch (error) {
      console.error('Error getting native device ID:', error);
      // Fallback to random UUID
      return `FALLBACK_${this.generateRandomUUID()}`;
    }
  }

  /**
   * Get unique device ID
   */
  static async getDeviceId(): Promise<string> {
    try {
      // First check if we have a stored device ID
      const storedDeviceId = await AsyncStorage.getItem(this.DEVICE_ID_KEY);
      if (storedDeviceId) {
        return storedDeviceId;
      }

      // Generate new device ID using native methods when possible
      const deviceId = await this.getNativeDeviceId();

      // Store for future use
      await AsyncStorage.setItem(this.DEVICE_ID_KEY, deviceId);
      
      console.log('Generated device ID:', deviceId);
      return deviceId;

    } catch (error) {
      console.error('Error generating device ID:', error);
      // Emergency fallback
      const uuid = this.generateRandomUUID();
      const emergencyId = `EMERGENCY_${uuid}`;
      return emergencyId;
    }
  }

  /**
   * Get installation ID - changes on app reinstall
   */
  static async getInstallationId(): Promise<string> {
    try {
      let installationId = await AsyncStorage.getItem(this.INSTALLATION_ID_KEY);
      
      if (!installationId) {
        const uuid = this.generateRandomUUID();
        installationId = `INSTALL_${uuid}`;
        await AsyncStorage.setItem(this.INSTALLATION_ID_KEY, installationId);
      }
      
      return installationId;
    } catch (error) {
      console.error('Error getting installation ID:', error);
      return `INSTALL_${this.generateRandomUUID()}`;
    }
  }

  /**
   * Get comprehensive device information
   */
  static async getDeviceInfo(): Promise<{
    deviceId: string;
    installationId: string;
    platform: string;
    osVersion: string;
    deviceName: string;
    modelName: string;
    brand: string;
    isDevice: boolean;
    deviceType: number;
  }> {
    try {
      const deviceId = await this.getDeviceId();
      const installationId = await this.getInstallationId();
      
      return {
        deviceId,
        installationId,
        platform: Platform.OS,
        osVersion: Device.osVersion || Platform.Version?.toString() || 'unknown',
        deviceName: Device.deviceName || 'unknown',
        modelName: Device.modelName || 'unknown',
        brand: Device.brand || 'unknown',
        isDevice: Device.isDevice || false,
        deviceType: Device.deviceType || 0,
      };
    } catch (error) {
      console.error('Error getting device info:', error);
      
      const deviceId = await this.getDeviceId();
      const installationId = await this.getInstallationId();
      
      return {
        deviceId,
        installationId,
        platform: Platform.OS,
        osVersion: 'unknown',
        deviceName: 'unknown',
        modelName: 'unknown',
        brand: 'unknown',
        isDevice: false,
        deviceType: 0,
      };
    }
  }

  /**
   * Clear device data (for testing or reset)
   */
  static async clearDeviceData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.DEVICE_ID_KEY,
        this.INSTALLATION_ID_KEY,
        `${this.DEVICE_ID_KEY}_component`
      ]);
      console.log('Device data cleared');
    } catch (error) {
      console.error('Error clearing device data:', error);
    }
  }

  /**
   * Get device fingerprint for additional security
   */
  static async getDeviceFingerprint(): Promise<string> {
    try {
      const info = await this.getDeviceInfo();
      const fingerprint = `${info.platform}_${info.brand}_${info.modelName}_${info.osVersion}_${info.deviceType}`;
      return fingerprint.replace(/[^a-zA-Z0-9_]/g, '_');
    } catch (error) {
      console.error('Error generating device fingerprint:', error);
      return `FINGERPRINT_${this.generateRandomUUID()}`;
    }
  }
}

export default DeviceIdentification;
