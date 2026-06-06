import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';

interface GuestGateProps {
  children: React.ReactNode;
  isGuest: boolean;
  onRegister: () => void;
}

export default function GuestGate({ children, isGuest, onRegister }: GuestGateProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!isGuest || dismissed) {
    return <>{children}</>;
  }

  function handleRegister() {
    setModalVisible(false);
    onRegister();
  }

  function handleDismiss() {
    setModalVisible(false);
    setDismissed(true);
  }

  return (
    <>
      {/* Children shown at reduced opacity — user sees what they are missing */}
      <View>
        <View style={styles.dimmedChildren} pointerEvents="none">
          {children}
        </View>
        {/* Invisible touch interceptor that sits over the children */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          onPress={() => setModalVisible(true)}
          activeOpacity={1}
        >
          <View style={styles.dimOverlay} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleDismiss}
      >
        {/* Backdrop tap closes modal */}
        <TouchableOpacity
          style={styles.modalBackdrop}
          onPress={handleDismiss}
          activeOpacity={1}
        >
          {/* Inner card — stopPropagation via nested touchable */}
          <TouchableOpacity
            style={styles.modalCard}
            onPress={() => {}}
            activeOpacity={1}
          >
            <Feather name="lock" size={24} color={Colors.textSecondary} />
            <Text style={styles.cardTitle}>{t('guest.lockedTitle')}</Text>
            <Text style={styles.cardSub}>{t('guest.lockedSub')}</Text>
            <Button
              label={t('guest.cta')}
              onPress={handleRegister}
              style={styles.cardBtn}
            />
            <TouchableOpacity
              onPress={handleDismiss}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.maybeLater}>{t('guest.maybeLater')}</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  dimmedChildren: {
    opacity: 0.45,
  },
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modalCard: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  cardSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  cardBtn: {
    width: '100%',
  },
  maybeLater: {
    fontSize: 13,
    color: Colors.textTertiary,
    marginTop: 14,
    textAlign: 'center',
  },
});
