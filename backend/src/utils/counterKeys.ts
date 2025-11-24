import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const keysFilePath = path.join(dataDir, "available_keys.json");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

interface KeysData {
  availableKeys: string[];
  usedKeys: string[];
}

function loadKeys(): KeysData {
  try {
    if (fs.existsSync(keysFilePath)) {
      const data = fs.readFileSync(keysFilePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading keys:", error);
  }
  return { availableKeys: [], usedKeys: [] };
}

function saveKeys(data: KeysData): void {
  try {
    fs.writeFileSync(keysFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving keys:", error);
  }
}

function generateCounterKey(): string {
  const year = new Date().getFullYear();
  const keys = loadKeys();
  
  const nextNumber = keys.usedKeys.length + keys.availableKeys.length + 1;
  const numberPart = String(nextNumber).padStart(3, '0');
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `CS-${year}-${numberPart}-${randomPart}`;
}

export function addAvailableKey(key?: string): string {
  const data = loadKeys();
  const newKey = key || generateCounterKey();
  
  if (!data.availableKeys.includes(newKey) && !data.usedKeys.includes(newKey)) {
    data.availableKeys.push(newKey);
    saveKeys(data);
  }
  
  return newKey;
}

export function useKey(key: string): boolean {
  const data = loadKeys();
  const index = data.availableKeys.indexOf(key);
  
  if (index === -1) {
    return false;
  }
  
  data.availableKeys.splice(index, 1);
  data.usedKeys.push(key);
  saveKeys(data);
  
  return true;
}

export function isKeyAvailable(key: string): boolean {
  const data = loadKeys();
  return data.availableKeys.includes(key);
}

export function getAvailableKeys(): string[] {
  const data = loadKeys();
  return data.availableKeys;
}

export function getUsedKeys(): string[] {
  const data = loadKeys();
  return data.usedKeys;
}

export function generateMultipleKeys(count: number): string[] {
  const keys: string[] = [];
  for (let i = 0; i < count; i++) {
    keys.push(addAvailableKey());
  }
  return keys;
}

export function removeKey(key: string): boolean {
  const data = loadKeys();
  const availableIndex = data.availableKeys.indexOf(key);
  const usedIndex = data.usedKeys.indexOf(key);
  
  if (availableIndex !== -1) {
    data.availableKeys.splice(availableIndex, 1);
    saveKeys(data);
    return true;
  }
  
  if (usedIndex !== -1) {
    data.usedKeys.splice(usedIndex, 1);
    saveKeys(data);
    return true;
  }
  
  return false;
}
