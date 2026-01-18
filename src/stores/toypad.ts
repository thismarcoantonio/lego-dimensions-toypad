import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useBluetoothStore } from './bluetooth';
import { ToypadPadType, type ToypadPad } from '@/types/Toypad';
import type { Character } from '@/types/Character';
import type { Vehicle } from '@/types/Vehicle';

const colors = ['Default', 'Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Pink', 'White', 'Purple'];
const weapons = ['None', 'Bolts', 'Mines', 'Spinning Weapon', 'Swarm Weapon'];
const defenses = ['None', 'Bomb', 'Shield', 'Speaker'];
const vehicleSkins = ['Default', 'Skin 1', 'Skin 2', 'Skin 3'];
const horns = ['Default', 'Horn A', 'Horn B', 'Horn C'];
const engineSounds = ['Default', 'Engine A', 'Engine B', 'Engine C'];
const chromeColors = ['Default', 'Chrome A', 'Chrome B', 'Chrome C', 'Chrome D'];

const defaultWeapon = [weapons[0]];
const defaultDefense = [defenses[0]];
const altColor = [vehicleSkins[0]];
const vehicleColors = [colors[0], colors[0], colors[0], colors[0], colors[0], colors[0]];
const horn = [horns[0]];
const engineSound = [engineSounds[0]];
const chromeColor = [chromeColors[0]];
const optionalVehicleAbilities = { guardian: true, spinAttack: true, follower: true };

export const useToypadStore = defineStore('toypad', () => {
  const bluetoothStore = useBluetoothStore();

  const pads = ref<ToypadPad[]>(
    Array.from({ length: 7 }, () => ({
      r: 0,
      g: 0,
      b: 0,
      minifigId: 0,
      vehicleId: 0,
      type: ToypadPadType.NONE,
      uid: 0,
    })),
  );

  async function onPadChange(padIndex: number) {
    const changePacket = [0x60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const currentPad = pads.value[padIndex];

    if (!currentPad) return;

    // Save pad number and type
    changePacket[1] = padIndex;
    changePacket[2] = currentPad.type;

    // Get Toypad ID based on Minifig or Vehicle
    let id = 0;
    if (currentPad.type == ToypadPadType.MINIFIG) id = currentPad.minifigId;
    if (currentPad.type == ToypadPadType.VEHICLE) id = currentPad.vehicleId;

    // Save pad id and uid
    changePacket[3] = (id & 0xff00) >> 8;
    changePacket[4] = id & 0xff;
    changePacket[5] = currentPad.uid;

    // Save additional information if toypad is vehicle
    if (currentPad.type == ToypadPadType.VEHICLE) {
      changePacket[6] =
        weapons.indexOf(defaultWeapon[0]!) | (defenses.indexOf(defaultDefense[0]!) << 4);
      changePacket[7] =
        vehicleSkins.indexOf(altColor[0]!) | (colors.indexOf(vehicleColors[0]!) << 4);
      changePacket[8] =
        colors.indexOf(vehicleColors[1]!) | (colors.indexOf(vehicleColors[2]!) << 4);
      changePacket[9] =
        colors.indexOf(vehicleColors[3]!) | (colors.indexOf(vehicleColors[4]!) << 4);
      changePacket[10] = horns.indexOf(horn[0]!) | (engineSounds.indexOf(engineSound[0]!) << 4);
      changePacket[11] =
        colors.indexOf(vehicleColors[5]!) | (chromeColors.indexOf(chromeColor[0]!) << 4);
      changePacket[12] =
        (optionalVehicleAbilities.guardian ? 1 : 0) |
        ((optionalVehicleAbilities.spinAttack ? 1 : 0) << 1) |
        ((optionalVehicleAbilities.follower ? 1 : 0) << 2);
    }

    // Send change packet to Toypad
    await bluetoothStore.sendRawSettingPacket(changePacket);
  }

  async function clearPad(padId: number) {
    if (!pads.value[padId]) return;

    pads.value[padId] = {
      ...pads.value[padId],
      type: ToypadPadType.NONE,
      minifigId: 0,
      vehicleId: 0,
      uid: 0,
    };

    await onPadChange(padId);
  }

  const nextUsableUid = computed(() => {
    const padUids = pads.value.map((pad) => pad.uid);
    const allUids = Array.from({ length: 7 }, (_, index) => index + 1);
    return allUids.find((uid) => !padUids.includes(uid)) || 0;
  });

  function updateToypadMinifig(padIndex: number, minifigId: Character['id'], uid?: number) {
    if (!pads.value[padIndex]) return;
    pads.value[padIndex] = {
      ...pads.value[padIndex],
      type: ToypadPadType.MINIFIG,
      minifigId,
      uid: uid ?? nextUsableUid.value,
    };
    onPadChange(padIndex);
  }

  function updateToypadVehicle(padIndex: number, vehicleId: Vehicle['id'], uid?: number) {
    if (!pads.value[padIndex]) return;
    pads.value[padIndex] = {
      ...pads.value[padIndex],
      type: ToypadPadType.VEHICLE,
      minifigId: 0,
      vehicleId,
      uid: uid ?? nextUsableUid.value,
    };
    onPadChange(padIndex);
  }

  function updatePadColor(index: number, colors: { r: number; g: number; b: number }) {
    if (!pads.value[index]) return;
    pads.value[index].r = colors.r;
    pads.value[index].g = colors.g;
    pads.value[index].b = colors.b;
  }

  function updatePadColors(colors: { r: number; g: number; b: number }[]) {
    updatePadColor(0, colors[0]!);
    updatePadColor(1, colors[1]!);
    updatePadColor(2, colors[1]!);
    updatePadColor(3, colors[1]!);
    updatePadColor(4, colors[2]!);
    updatePadColor(5, colors[2]!);
    updatePadColor(6, colors[2]!);
  }

  return {
    pads,
    updateToypadMinifig,
    updateToypadVehicle,
    clearPad,
    updatePadColors,
  };
});
