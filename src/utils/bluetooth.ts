enum Characteristics {
  SETTINGS = '0000ff11-0000-1000-8000-0000524c4254',
  NOTIFICATIONS = '0000ff12-0000-1000-8000-0000524c4254',
  TOYPAD = '0000ff13-0000-1000-8000-0000524c4254',
  AUTH = '0000ff14-0000-1000-8000-0000524c4254',
}

export async function connectToBluetooth() {
  // Check for Bluetooth support
  if (!navigator.bluetooth) throw new Error('Web Bluetooth API is not supported in this browser.');

  // Check if Bluetooth is available
  const isBluetoothAvailable = await navigator.bluetooth.getAvailability();
  if (!isBluetoothAvailable) throw new Error('Bluetooth is not available on this device.');

  const device = await navigator.bluetooth.requestDevice({
    filters: [{ services: [0x524c] }],
    optionalServices: ['0000ff10-0000-1000-8000-0000524c4254'],
  });
  if (!device) throw new Error('No Bluetooth device selected.');

  const gattServer = await device.gatt?.connect();
  if (!gattServer) throw new Error('Failed to connect to Bluetooth server.');

  const service = await gattServer.getPrimaryService('0000ff10-0000-1000-8000-0000524c4254');
  if (!service) throw new Error('Failed to get primary Bluetooth service.');

  const [settings, notifications, toypad, auth] = await Promise.all([
    service.getCharacteristic(Characteristics.SETTINGS),
    service.getCharacteristic(Characteristics.NOTIFICATIONS),
    service.getCharacteristic(Characteristics.TOYPAD),
    service.getCharacteristic(Characteristics.AUTH),
  ]);

  return {
    device,
    service,
    characteristics: { settings, notifications, toypad, auth },
  };
}
