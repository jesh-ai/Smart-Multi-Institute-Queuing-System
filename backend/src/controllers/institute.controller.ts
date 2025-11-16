import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_BASE_PATH = path.join(__dirname, '../../configs');
const INSTITUTE_INFO_PATH = path.join(CONFIG_BASE_PATH, 'institute_info.json');

interface Service {
  requirements: string[];
  name: string;
  form: string;
}

interface InstituteInfo {
  name: string;
  welcome_message: string;
  service_list: Service[];
  privacy_notice: string;
}

interface PrivacyNoticeSection {
  heading: string;
  content: string;
  list?: string[];
  additionalContent?: string;
}

interface PrivacyNotice {
  title: string;
  sections: PrivacyNoticeSection[];
}

interface FormField {
  id: string;
  fieldNumber?: string;
  label: string;
  fieldType: string;
  required: boolean;
  adminOnly?: boolean;
  instructions?: string;
  placeholder?: string;
  options?: string[];
  validation?: {
    pattern?: string;
    message?: string;
  };
}

interface FormSection {
  id: string;
  name: string;
  fields: FormField[];
}

interface FormData {
  institutions?: Array<{
    id: string;
    name: string;
    code: string;
    description: string;
    forms: Array<{
      id: string;
      formNumber: string;
      title: string;
      officialTitle: string;
      description: string;
      category: string;
      version: string;
      pages: number;
      totalFields: number;
      sections: FormSection[];
    }>;
  }>;
  sections?: FormSection[];
}

export let instituteInfo: InstituteInfo | null = null;
export let privacyNotice: PrivacyNotice | null = null;
export let services: Service[] | null = null;
export const forms: Map<string, FormData> = new Map();

export async function startBackend() {
  const instituteInfo = await loadInstituteInfo();
  if (instituteInfo.privacy_notice) {
    await loadPrivacyNotice(instituteInfo);
  }
  
  const services = await loadServices();
  for (const service of services) {
    if (service.form) {
      await loadFormData(service.form);
    }
  }
}

async function loadInstituteInfo(): Promise<InstituteInfo> {
  if (instituteInfo) {
    return instituteInfo;
  }
  
  const data = await fs.readFile(INSTITUTE_INFO_PATH, 'utf-8');
  instituteInfo = JSON.parse(data) as InstituteInfo;
  return instituteInfo;
}

async function loadServices(): Promise<Service[]> {
  if (services) {
    return services;
  }
  
  const instituteData = await loadInstituteInfo();
  services = instituteData.service_list;
  return services;
}

async function loadPrivacyNotice(instituteInfo: InstituteInfo): Promise<PrivacyNotice> {
  if (privacyNotice) {
    return privacyNotice;
  }
  
  const privacyNoticePath = path.join(CONFIG_BASE_PATH, instituteInfo.privacy_notice);
  const privacyData = await fs.readFile(privacyNoticePath, 'utf-8');
  privacyNotice = JSON.parse(privacyData) as PrivacyNotice;
  return privacyNotice;
}

async function loadFormData(formPath: string): Promise<FormData> {
  if (forms.has(formPath)) {
    return forms.get(formPath)!;
  }
  
  const fullPath = path.join(CONFIG_BASE_PATH, formPath);
  const formData = await fs.readFile(fullPath, 'utf-8');
  const parsedForm = JSON.parse(formData) as FormData;
  
  forms.set(formPath, parsedForm);
  
  return parsedForm;
}

export const getInstituteInfo = async (req: Request, res: Response) => {
  try {
    const instituteInfo: InstituteInfo = await loadInstituteInfo();
    res.json(instituteInfo);
  } catch (error) {
    console.error('Error reading institute info:', error);
    res.status(500).json({ error: 'Failed to load institute information' });
  }
};


export const getServices = async (req: Request, res: Response) => {
  try {
    const serviceList: Service[] = await loadServices();
    res.json(serviceList);
  } catch (error) {
    console.error('Error reading services:', error);
    res.status(500).json({ error: 'Failed to load services' });
  }
};

export const getFormByServiceId = async (req: Request, res: Response) => {
  try {
    const { serviceid } = req.params;
    const serviceIndex = parseInt(serviceid);

    const instituteInfo: InstituteInfo = await loadInstituteInfo();

    if (isNaN(serviceIndex) || serviceIndex < 0 || serviceIndex >= instituteInfo.service_list.length) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service: Service = instituteInfo.service_list[serviceIndex];
    
    if (!service.form) {
      return res.status(404).json({ error: 'Form not configured for this service' });
    }

    const form: FormData = await loadFormData(service.form);

    res.json({
      service: {
        name: service.name,
        requirements: service.requirements
      },
      form: form
    });
  } catch (error) {
    console.error('Error reading form:', error);
    res.status(500).json({ error: 'Failed to load form' });
  }
};

export const getPrivacyNotice = async (req: Request, res: Response) => {
  try {
    const instituteInfo: InstituteInfo = await loadInstituteInfo();

    if (!instituteInfo.privacy_notice) {
      return res.status(404).json({ error: 'Privacy notice not configured' });
    }

    const privacyNotice: PrivacyNotice = await loadPrivacyNotice(instituteInfo);

    res.json(privacyNotice);
  } catch (error) {
    console.error('Error reading privacy notice:', error);
    res.status(500).json({ error: 'Failed to load privacy notice' });
  }
};
