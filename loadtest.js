import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  // Pehle sirf 10 users ke sath 10 seconds tak test karenge (check karne ke liye ki sab sahi hai)
  // Jab yeh pass ho jaye, tab aap isko vus: 1000 ya 3000 kar dena
  vus: 2000,          
  duration: '30s',    
};

export default function () {
  // Frontend ke hisaab se sahi route /auth/login hai
  const url = 'http://localhost:5000/api/auth/login'; 
  
  // Aapke MongoDB se asli User details
  const payload = JSON.stringify({
    userId: 'WF1450538', 
    password: '555555',
    deviceId: '06a6ee645c8546f0a5f80e04b22dd4bd' // Asli device ID
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  // Success check
  const isSuccessful = check(res, {
    'login successful (200)': (r) => r.status === 200,
  });

  // Agar fail hota hai, toh console me bata dega ki backend ne kya error diya
  if (!isSuccessful) {
    console.log(`Failed! Status: ${res.status} | Error: ${res.body}`);
  }

  sleep(1);
}