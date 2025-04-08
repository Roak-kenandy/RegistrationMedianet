const CRM_BASE_URL = 'https://app.crm.com/backoffice/v2';
const MTV_BASE_URL = 'https://mtvdev.medianet.mv/api/v1';
const DEFAULT_API_KEY = 'c54504d4-0fbe-41cc-a11e-822710db9b8d';
const DEFAULT_TAG_ID = '0c0d20c2-08e1-4483-bcbe-638608fedaba';

module.exports = {
  CRM_BASE_URL,
  MTV_BASE_URL,
  API_KEY: process.env.CRM_API_KEY || DEFAULT_API_KEY,
  DEFAULT_TAG_ID,
  CRM_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'api_key': process.env.CRM_API_KEY || DEFAULT_API_KEY,
  },
  MTV_HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
};