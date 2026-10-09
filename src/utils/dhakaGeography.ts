import { TrafficZone, DhakaLandmark, RouteLocation } from '../types/routes';

export const DHAKA_DEPOTS: Record<string, RouteLocation> = {
  MIRPUR_HQ: {
    name: 'FieldOps Central HQ (Mirpur-10)',
    address: 'Plot 12, Road 4, Section 10, Mirpur, Dhaka 1216',
    lat: 23.8069,
    lng: 90.3687,
  },
  GULSHAN_HUB: {
    name: 'FieldOps Gulshan Field Hub',
    address: 'House 44, Road 11, Block D, Gulshan-1, Dhaka 1212',
    lat: 23.7925,
    lng: 90.4162,
  },
  MOTIJHEEL_BRANCH: {
    name: 'FieldOps Commercial Dispatch (Motijheel)',
    address: 'Dilkusha C/A, Motijheel, Dhaka 1000',
    lat: 23.7289,
    lng: 90.4184,
  },
  EPZ_SAVAR_STATION: {
    name: 'Savar EPZ Industrial Base',
    address: 'DEPZ Area, GEPZ, Savar, Dhaka 1349',
    lat: 23.9422,
    lng: 90.2711,
  },
};

export const MAJOR_DHAKA_LANDMARKS: DhakaLandmark[] = [
  { id: 'lm-1', name: 'Grameenphone Corporate HQ', nameBn: 'গ্রামীণফোন হেডকোয়ার্টার', area: 'Bashundhara R/A', lat: 23.8223, lng: 90.4276 },
  { id: 'lm-2', name: 'DESCO Central Bhaban', nameBn: 'ডেসকো ভবন', area: 'Nikunja 2, Khilkhet', lat: 23.8328, lng: 90.4172 },
  { id: 'lm-3', name: 'Walton Corporate Office', nameBn: 'ওয়ালটন কর্পোরেট অফিস', area: 'Bashundhara', lat: 23.8152, lng: 90.4288 },
  { id: 'lm-4', name: 'Square Hospitals Ltd', nameBn: 'স্কয়ার হাসপাতাল', area: 'Panthapath / Farmgate', lat: 23.7528, lng: 90.3815 },
  { id: 'lm-5', name: 'Standard Chartered Bank', nameBn: 'স্ট্যান্ডার্ড চার্টার্ড ব্যাংক', area: 'Gulshan 1', lat: 23.7788, lng: 90.4158 },
  { id: 'lm-6', name: 'Bangladesh Bank HQ', nameBn: 'বাংলাদেশ ব্যাংক', area: 'Motijheel', lat: 23.7265, lng: 90.4178 },
  { id: 'lm-7', name: 'BEXIMCO Industrial Park', nameBn: 'বেক্সিমকো পার্ক', area: 'Zirabo, Savar', lat: 23.9512, lng: 90.2855 },
  { id: 'lm-8', name: 'Tejgaon Industrial Area Complex', nameBn: 'তেজগাঁও শিল্প এলাকা', area: 'Tejgaon', lat: 23.7633, lng: 90.3988 },
];

export const DHAKA_TRAFFIC_ZONES: TrafficZone[] = [
  {
    id: 'tz-farmgate',
    name: 'Farmgate - Kawran Bazar Bottleneck',
    nameBn: 'ফার্মগেট - কারওয়ান বাজার ট্রাফিক জ্যাম',
    center: { lat: 23.7567, lng: 90.3872 },
    radiusMeters: 1200,
    congestionLevel: 'CRITICAL',
    multiplier: 2.8,
    reason: 'Metro Rail station passenger rush & VIP movement corridors',
  },
  {
    id: 'tz-mohakhali',
    name: 'Mohakhali Flyover & Bus Terminal Gridlock',
    nameBn: 'মহাখালী বাস টার্মিনাল সিগন্যাল',
    center: { lat: 23.7781, lng: 90.4012 },
    radiusMeters: 1500,
    congestionLevel: 'HIGH',
    multiplier: 2.4,
    reason: 'Interdistrict bus transit & Express Elevated merger point',
  },
  {
    id: 'tz-bijoy-sarani',
    name: 'Bijoy Sarani Intersection',
    nameBn: 'বিজয় সরণি সিগন্যাল',
    center: { lat: 23.7652, lng: 90.3821 },
    radiusMeters: 1000,
    congestionLevel: 'HIGH',
    multiplier: 2.2,
    reason: 'Prime Minister Office corridor & Tejgaon flyover ramp slowdown',
  },
  {
    id: 'tz-old-dhaka',
    name: 'Old Dhaka Narrow Lanes & Sadarghat',
    nameBn: 'পুরান ঢাকা সংকীর্ণ সড়ক',
    center: { lat: 23.7099, lng: 90.4071 },
    radiusMeters: 2000,
    congestionLevel: 'CRITICAL',
    multiplier: 3.1,
    reason: 'Narrow alleys, non-motorized rickshaws, and dense wholesale markets',
  },
  {
    id: 'tz-waterlogging',
    name: 'Mirpur-2 & Kazipara Monsoonal Waterlogging',
    nameBn: 'মিরপুর কাজী পাড়া জলাবদ্ধতা এলাকা',
    center: { lat: 23.7915, lng: 90.3722 },
    radiusMeters: 800,
    congestionLevel: 'MODERATE',
    multiplier: 1.8,
    reason: 'Heavy rain drainage waterlogging & road repair work',
  },
];
