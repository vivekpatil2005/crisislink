import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SafeZone {
    id: bigint;
    latitude: number;
    name: string;
    district: string;
    state: string;
    longitude: number;
    zoneType: string;
}
export interface SOSAlert {
    id: bigint;
    latitude: number;
    name: string;
    longitude: number;
    message: string;
    timestamp: bigint;
}
export interface backendInterface {
    filterSafeZonesByState(state: string): Promise<Array<SafeZone>>;
    filterSafeZonesByType(zoneType: string): Promise<Array<SafeZone>>;
    getLatestAlerts(): Promise<Array<SOSAlert>>;
    getSafeZones(): Promise<Array<SafeZone>>;
    submitSos(name: string, message: string, latitude: number, longitude: number): Promise<SOSAlert>;
}
