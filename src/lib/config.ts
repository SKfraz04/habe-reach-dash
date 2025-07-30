// API Configuration
const authToken = JSON.parse(localStorage.getItem('userData') || '{}')
export const API_CONFIG = {
  BASE_URL: 'https://habe-ico-api.zip2box.com/api',
  ENDPOINTS: {
    LOGIN: '/utm/manager/login',
    VERIFY_OTP: '/utm/manager/verify-otp',
    TRANSACTIONS: '/transactions/getAll',
    WITHDRAWALS: '/withdrawals',
  },
  AUTH_TOKEN: authToken?.data?.token,
} as const;
