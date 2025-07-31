// API Configuration
const userData = JSON.parse(localStorage.getItem('userData') || '{}');
const authToken = localStorage.getItem('authToken') || userData?.data?.token || userData?.token || '';

export const API_CONFIG = {
  BASE_URL: 'https://habe-ico-api.zip2box.com/api',
  ENDPOINTS: {
    LOGIN: '/utm/manager/login',
    VERIFY_OTP: '/utm/manager/verify-otp',
    TRANSACTIONS: '/transactions/getAll',
    WITHDRAWALS: '/utm/managers/{managerId}/withdrawals',
  },
  AUTH_TOKEN: authToken,
  MANAGER_ID: userData?.data?.id || userData?.id || '687a1b6b9aa9183ecf3667bb',
} as const;
