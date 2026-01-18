import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as bluetoothUtils from '@/utils/bluetooth';
import { useToypadStore } from '@/stores/toypad';
import { ToypadPadType } from '@/types/Toypad';

let firstLegoReceive = true;

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

  async function initialize() {
    const toypadStore = useToypadStore();

    await characteristics.value?.toypad.startNotifications();
    characteristics.value?.toypad.addEventListener('characteristicvaluechanged', (event) => {
      const currentTarget = event.currentTarget as BluetoothRemoteGATTCharacteristic;
      const eventTarget = event.target as BluetoothRemoteGATTCharacteristic;

      if (!currentTarget?.value || !eventTarget?.value) return;

      const buffer = new Uint8Array(currentTarget?.value?.buffer || eventTarget?.value?.buffer);
      if (!buffer) return;

      const packet = [...buffer];

      const packets: { data: number[]; type: number }[] = [];
      let packetsIndex = 0;
      let packetLength = 0;
      let packetIndex = 0;

      for (let i = 0; i < packet.length; i++) {
        if (packetLength == 0) packetLength = packet[i]!;
        if (packetLength + 2 == packetIndex) {
          packetLength = packet[i]!;
          packetIndex = 0;
          packetsIndex++;
        }
        if (!packets[packetsIndex]) packets[packetsIndex] = { type: 0, data: [] };
        if (packetIndex == 1) packets[packetsIndex]!.type = packet[i]!;
        if (packetIndex > 1) packets[packetsIndex]!.data.push(packet[i]!);
        packetIndex++;
      }

      for (let i = 0; i < packets.length; i++) {
        const currentPacket = packets[i];
        if (currentPacket?.type === 2) {
          // Lego Dimensions Colors
          toypadStore.updatePadColors([
            { r: currentPacket.data[0]!, g: currentPacket.data[1]!, b: currentPacket.data[2]! },
            { r: currentPacket.data[3]!, g: currentPacket.data[4]!, b: currentPacket.data[5]! },
            { r: currentPacket.data[6]!, g: currentPacket.data[7]!, b: currentPacket.data[8]! },
          ]);

          if (firstLegoReceive) {
            for (let j = 0; j < 7; j++) {
              const toypad = { ...toypadStore.pads[j]! };

              toypad.type = packets[i]!.data[j * 4 + 9]!;
              if (toypad.type !== ToypadPadType.NONE) {
                const id = (packets[i]!.data[j * 4 + 10]! << 8) + packets[i]!.data[j * 4 + 11]!;
                if (toypad.type === ToypadPadType.MINIFIG) toypad.minifigId = id;
                if (toypad.type === ToypadPadType.VEHICLE) toypad.vehicleId = id;
              } else {
                toypad.minifigId = 0;
                toypad.vehicleId = 0;
              }

              toypadStore.pads[j] = toypad;
            }

            firstLegoReceive = false;
          }
        } else if (packets[i]?.type === 3) {
          // $scope.legoDimensionsWriteValues.index = packets[i].data[0];
          // $scope.legoDimensionsWriteValues.pagesReceived.push(packets[i].data[1]);
          // $scope.legoDimensionsWriteValues.pages[packets[i].data[1]] = [
          //   packets[i].data[2],
          //   packets[i].data[3],
          //   packets[i].data[4],
          //   packets[i].data[5],
          // ];
          // if (
          //   $scope.legoDimensionsWriteValues.pagesReceived.indexOf(0x23) != -1 &&
          //   $scope.legoDimensionsWriteValues.pagesReceived.indexOf(0x24) != -1 &&
          //   $scope.legoDimensionsWriteValues.pagesReceived.indexOf(0x25) != -1
          // ) {
          //   var vehicleId = Number(
          //     (BigInt($scope.legoDimensionsWriteValues.pages[0x24][3]) << 24n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x24][2]) << 16n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x24][1]) << 8n) |
          //       BigInt($scope.legoDimensionsWriteValues.pages[0x24][0]),
          //   );
          //   var upgradeId = Number(
          //     (BigInt($scope.legoDimensionsWriteValues.pages[0x25][3]) << 56n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x25][2]) << 48n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x25][1]) << 40n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x25][0]) << 32n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x23][3]) << 24n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x23][2]) << 16n) |
          //       (BigInt($scope.legoDimensionsWriteValues.pages[0x23][1]) << 8n) |
          //       BigInt($scope.legoDimensionsWriteValues.pages[0x23][0]),
          //   );
          //   console.log(
          //     'Lego Dimensions Write - Index:',
          //     $scope.legoDimensionsWriteValues.index,
          //     '; Vehicle ID:',
          //     vehicleId,
          //     '; Upgrade ID:',
          //     upgradeId,
          //   );
          //   $scope.legoDimensionsWriteValues = { index: 0, pagesReceived: [], pages: {} };
          // }
        } else if (packets[i]!.type == 0xf0) {
          console.log('Missed packet');
          // const packetNumber =
          //   (packets[i]!.data[0]! << 24) +
          //   (packets[i]!.data[1]! << 16) +
          //   (packets[i]!.data[2]! << 8) +
          //   packets[i]!.data[3]!;
          // if (packetNumber != $scope.firmwarePacketToStartOn) {
          //   $scope.firmwarePacketToStartOn = packetNumber;
          //   $scope.firmwarePacketMiss = true;
          //   console.log('Packet Miss, last known packet', $scope.firmwarePacketToStartOn);
          // } else {
          //   //If same packet is missed twice in a row, assume it's an error until it happens again
          //   $scope.firmwarePacketToStartOn = 0;
          // }
        }
      }
    });
  }

  async function connect() {
    status.value = 'loading';
    try {
      const response = await bluetoothUtils.connectToBluetooth();
      device.value = response.device;
      service.value = response.service;
      characteristics.value = response.characteristics;
      status.value = 'success';
      initialize();
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
