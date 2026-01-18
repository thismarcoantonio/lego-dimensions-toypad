import { defineStore } from 'pinia';
import { useBluetoothStore } from './bluetooth';
import { ToypadPadType, type ToypadPad } from '@/types/Toypad';

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
const altVehicleColor = false;
const useVehicleBombs = false;
const firstLegoReceive = true;

export const useToypadStore = defineStore('toypad', () => {
  const bluetoothStore = useBluetoothStore();

  const pads: ToypadPad[] = Array.from({ length: 7 }, () => ({
    r: 0,
    g: 0,
    b: 0,
    minifigId: 0,
    vehicleId: 0,
    type: ToypadPadType.NONE,
    uid: 0,
  }));

  async function onPadChange(padIndex: number) {
    const changePacket = [0x60, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const currentPad = pads[padIndex];

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

    // $scope.updateViableMinifigs();
    // $scope.updateViableVehicles();
    // $scope.getDropTargets();
  }

  async function clearPad(padIndex: number) {
    const currentPad = pads[padIndex];
    if (!currentPad) return;

    // TODO: Update recent minifigs
    if (currentPad.type === ToypadPadType.MINIFIG) {
      // for (var i = 0; i < $scope.recentMinifigs.length; i++) {
      //   if ($scope.recentMinifigs[i] == $scope.legoDimensionsPads[index].minifigId) {
      //     $scope.recentMinifigs.splice(i, 1);
      //     break;
      //   }
      // }
      // $scope.recentMinifigs.unshift($scope.legoDimensionsPads[index].minifigId);
    }

    // TODO: Update recent vehicles
    if (currentPad.type === ToypadPadType.VEHICLE) {
      // for (var i = 0; i < $scope.recentVehicles.length; i++) {
      //   if ($scope.recentVehicles[i] == $scope.legoDimensionsPads[index].vehicleId) {
      //     $scope.recentVehicles.splice(i, 1);
      //     break;
      //   }
      // }
      // $scope.recentVehicles.unshift($scope.legoDimensionsPads[index].vehicleId);
    }

    currentPad.type = ToypadPadType.NONE;
    currentPad.vehicleId = 0;
    currentPad.minifigId = 0;
    currentPad.uid = 0;
    pads[padIndex] = currentPad;
    await onPadChange(padIndex);
    // $scope.legoDimensionsVehicleOptionsOnPage[index] = $scope.vehiclePlaceholder;
    // $scope.legoDimensionsMinifigOptionsOnPage[index] = $scope.minifigPlaceholder;
  }

  return {
    pads,
    onPadChange,
    clearPad,
  };
});
