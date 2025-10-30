import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { checkNetworkConnection, getNetworkType } from '@/lib/networkUtils';
import { apiUrl } from '@/constants/API';
import { getDeviceInfo } from '@/lib/deviceUtils';
import COLORS from '@/constants/COLORS';

export default function DebugScreen() {
    const [logs, setLogs] = useState<string>('');
    const [networkStatus, setNetworkStatus] = useState<string>('Checking...');
    const [deviceInfo, setDeviceInfo] = useState<any>({});

    useEffect(() => {
        loadDebugInfo();
    }, []);

    const loadDebugInfo = async () => {
        // Get device info
        const device = getDeviceInfo();
        setDeviceInfo(device);

        // Check network
        try {
            const isConnected = await checkNetworkConnection();
            const networkType = await getNetworkType();
            setNetworkStatus(`Connected: ${isConnected}, Type: ${networkType}`);
        } catch (error) {
            setNetworkStatus(`Error: ${error}`);
        }

        // Load logs
        const exportedLogs = await logger.exportLogs();
        setLogs(exportedLogs);
    };

    const testApiHealth = async () => {
        try {
            await logger.info('Testing API health endpoint');
            const response = await fetch(`${apiUrl}/health`);
            const data = await response.json();

            Alert.alert('API Health Test',
                `Status: ${response.status}\nData: ${JSON.stringify(data, null, 2)}`);

            await logger.info('API health test completed', {
                status: response.status,
                data
            });
        } catch (error: any) {
            Alert.alert('API Health Test Failed', error.message);
            await logger.error('API health test failed', error);
        }
    };

    const testLoginEndpoint = async () => {
        try {
            await logger.info('Testing login endpoint with dummy data');
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: 'test@example.com',
                    password: 'testpass'
                }),
            });

            const data = await response.json();

            Alert.alert('Login Test',
                `Status: ${response.status}\nMessage: ${data.message || 'No message'}`);

            await logger.info('Login endpoint test completed', {
                status: response.status,
                data
            });
        } catch (error: any) {
            Alert.alert('Login Test Failed', error.message);
            await logger.error('Login endpoint test failed', error);
        }
    };

    const clearLogs = async () => {
        await logger.clearLogs();
        setLogs('');
        Alert.alert('Debug', 'Logs cleared');
    };

    const exportLogs = async () => {
        const exportedLogs = await logger.exportLogs();
        Alert.alert('Exported Logs', exportedLogs, [
            { text: 'Copy', onPress: () => { } },
            { text: 'OK' }
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Debug Information</Text>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Environment</Text>
                <Text style={styles.text}>API URL: {apiUrl}</Text>
                <Text style={styles.text}>Network: {networkStatus}</Text>
                <Text style={styles.text}>Device: {deviceInfo.isTablet ? 'Tablet' : 'Phone'}</Text>
                <Text style={styles.text}>iPad: {deviceInfo.isIpad ? 'Yes' : 'No'}</Text>
                <Text style={styles.text}>Platform: {deviceInfo.platform}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tests</Text>
                <TouchableOpacity style={styles.button} onPress={testApiHealth}>
                    <Text style={styles.buttonText}>Test API Health</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={testLoginEndpoint}>
                    <Text style={styles.buttonText}>Test Login Endpoint</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={loadDebugInfo}>
                    <Text style={styles.buttonText}>Refresh Info</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Logs</Text>
                <TouchableOpacity style={styles.button} onPress={exportLogs}>
                    <Text style={styles.buttonText}>Export Logs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={clearLogs}>
                    <Text style={styles.buttonText}>Clear Logs</Text>
                </TouchableOpacity>
                <ScrollView style={styles.logsContainer}>
                    <Text style={styles.logsText}>{logs || 'No logs available'}</Text>
                </ScrollView>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: COLORS.background,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: COLORS.textPrimary,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: COLORS.textPrimary,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
        color: COLORS.textSecondary,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: COLORS.white,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    logsContainer: {
        backgroundColor: COLORS.cardBackground,
        padding: 10,
        borderRadius: 5,
        maxHeight: 300,
    },
    logsText: {
        fontSize: 12,
        fontFamily: 'monospace',
        color: COLORS.textPrimary,
    },
});