export enum ToypadPadType {
  NONE = 0,
  MINIFIG = 1,
  VEHICLE = 2,
}

export interface ToypadPad {
  r: number;
  g: number;
  b: number;
  minifigId: number;
  vehicleId: number;
  type: number;
  uid: ToypadPadType;
}
