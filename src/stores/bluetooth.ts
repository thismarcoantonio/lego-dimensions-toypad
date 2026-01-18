import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as bluetoothUtils from '@/utils/bluetooth';

export const useBluetoothStore = defineStore('bluetooth', () => {
  const status = ref<'loading' | 'success' | 'error'>();
  const error = ref<Error>();
  const device = ref<BluetoothDevice>();
  const service = ref<BluetoothRemoteGATTService>();
  const characteristics = ref<{
    settings: BluetoothRemoteGATTCharacteristic;
    notifications: BluetoothRemoteGATTCharacteristic;
    toypad: BluetoothRemoteGATTCharacteristic;
    auth: BluetoothRemoteGATTCharacteristic;
  }>();

  async function connect() {
    status.value = 'loading';
    try {
      const response = await bluetoothUtils.connectToBluetooth();
      device.value = response.device;
      service.value = response.service;
      characteristics.value = response.characteristics;
      status.value = 'success';
    } catch (_error) {
      status.value = 'error';
      error.value = _error as Error;
    }
  }

  function sendRawSettingPacket(packet: Iterable<number>) {
    if (!characteristics.value || !characteristics.value.notifications) return;
    return characteristics.value.notifications.writeValue(new Uint8Array(packet));
  }

  return {
    device,
    service,
    characteristics,
    connect,
    sendRawSettingPacket,
  };
});
