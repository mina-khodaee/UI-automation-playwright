import { APIRequestContext } from '@playwright/test';

export async function loginViaApi(request: APIRequestContext) {
  const response = await request.post('https://192.168.1.19:7036/api/v1/Auth/Login', {
    data: {
      username: 'superadmin',
      password: '123456',
    },
  });

  if (!response.ok()) {
    const body = await response.text();

    throw new Error(`Login failed: ${response.status()} - ${body}`);
  }

  const data = await response.json();

  return {
    accessToken: data.accessToken,
  };
}
