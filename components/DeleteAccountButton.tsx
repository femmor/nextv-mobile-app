import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';

export default function DeleteAccountButton() {
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const { deleteAccount } = useAuthStore();

    const handleDeleteAccount = async () => {
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter your password to confirm account deletion');
            return;
        }

        setIsDeleting(true);

        try {
            const result = await deleteAccount(password);

            if (result.success) {
                Alert.alert(
                    'Account Deleted',
                    'Your account has been permanently deleted.',
                    [{ text: 'OK' }]
                );
                setShowModal(false);
            } else {
                Alert.alert('Error', result.message || 'Failed to delete account');
            }
        } catch (error) {
            console.log("Error:", error)
            Alert.alert('Error', 'An unexpected error occurred');
        } finally {
            setIsDeleting(false);
            setPassword('');
        }
    };

    const showDeleteConfirmation = () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to permanently delete your account? This action cannot be undone and will remove all your data.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Continue',
                    style: 'destructive',
                    onPress: () => setShowModal(true)
                }
            ]
        );
    };

    return (
        <>
            <TouchableOpacity
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    backgroundColor: '#ffebee',
                    borderRadius: 8,
                    marginTop: 20,
                    justifyContent: 'center',
                }}
                onPress={showDeleteConfirmation}
            >
                <Ionicons name="trash-outline" size={20} color="#d32f2f" />
                <Text style={{
                    marginLeft: 8,
                    color: '#d32f2f',
                    fontSize: 16,
                    fontWeight: '500',
                }}>
                    Delete Account
                </Text>
            </TouchableOpacity>

            <Modal
                visible={showModal}
                transparent
                animationType="fade"
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    padding: 20
                }}>
                    <View style={{
                        backgroundColor: 'white',
                        borderRadius: 12,
                        padding: 24
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '600',
                            marginBottom: 12,
                            color: '#d32f2f'
                        }}>
                            Confirm Account Deletion
                        </Text>

                        <Text style={{
                            fontSize: 14,
                            color: '#666',
                            marginBottom: 20,
                            lineHeight: 20
                        }}>
                            Enter your password to permanently delete your account and all associated data.
                        </Text>

                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: '#ddd',
                                borderRadius: 8,
                                padding: 12,
                                marginBottom: 20,
                                fontSize: 16
                            }}
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                        />

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            gap: 12
                        }}>
                            <TouchableOpacity
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 24,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: '#ddd'
                                }}
                                onPress={() => {
                                    setShowModal(false);
                                    setPassword('');
                                }}
                                disabled={isDeleting}
                            >
                                <Text style={{ color: '#666' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    paddingVertical: 12,
                                    paddingHorizontal: 24,
                                    borderRadius: 8,
                                    backgroundColor: '#d32f2f',
                                    opacity: isDeleting ? 0.6 : 1
                                }}
                                onPress={handleDeleteAccount}
                                disabled={isDeleting}
                            >
                                <Text style={{ color: 'white', fontWeight: '500' }}>
                                    {isDeleting ? 'Deleting...' : 'Delete Account'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}