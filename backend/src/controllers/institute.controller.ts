import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_BASE_PATH = path.join(__dirname, '../../configs');
const INSTITUTE_INFO_PATH = path.join(CONFIG_BASE_PATH, 'institute_info.json');

export const getInstituteInfo = async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(INSTITUTE_INFO_PATH, 'utf-8');
    const instituteInfo = JSON.parse(data);
    res.json(instituteInfo);
  } catch (error) {
    console.error('Error reading institute info:', error);
    res.status(500).json({ error: 'Failed to load institute information' });
  }
};


export const getServices = async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(INSTITUTE_INFO_PATH, 'utf-8');
    const instituteInfo = JSON.parse(data);
    res.json(instituteInfo.service_list);
  } catch (error) {
    console.error('Error reading services:', error);
    res.status(500).json({ error: 'Failed to load services' });
  }
};

export const getFormByServiceId = async (req: Request, res: Response) => {
  try {
    const { serviceid } = req.params;
    const serviceIndex = parseInt(serviceid);

    const data = await fs.readFile(INSTITUTE_INFO_PATH, 'utf-8');
    const instituteInfo = JSON.parse(data);

    if (isNaN(serviceIndex) || serviceIndex < 0 || serviceIndex >= instituteInfo.service_list.length) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = instituteInfo.service_list[serviceIndex];
    
    if (!service.form) {
      return res.status(404).json({ error: 'Form not configured for this service' });
    }

    const formPath = path.join(CONFIG_BASE_PATH, service.form);
    
    const formData = await fs.readFile(formPath, 'utf-8');
    const form = JSON.parse(formData);

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
    // Read institute info to get privacy notice path
    const data = await fs.readFile(INSTITUTE_INFO_PATH, 'utf-8');
    const instituteInfo = JSON.parse(data);

    if (!instituteInfo.privacy_notice) {
      return res.status(404).json({ error: 'Privacy notice not configured' });
    }

    const privacyNoticePath = path.join(CONFIG_BASE_PATH, instituteInfo.privacy_notice);
    
    const privacyData = await fs.readFile(privacyNoticePath, 'utf-8');
    const privacyNotice = JSON.parse(privacyData);

    res.json(privacyNotice);
  } catch (error) {
    console.error('Error reading privacy notice:', error);
    res.status(500).json({ error: 'Failed to load privacy notice' });
  }
};
