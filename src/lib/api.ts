import type { DateRequest, DateRequestInput } from './dates';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://myapp-614442359463.us-east1.run.app';

export async function getContent() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/content`);
    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
}

export async function login(username: string, password: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Invalid credentials' }));
      throw new Error(errorData.message || 'Login failed');
    }

    const { token } = await response.json();
    if (token) {
      localStorage.setItem('auth_token', token);
      return { success: true };
    }
    throw new Error('No token received');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

export async function createDateRequest(input: DateRequestInput) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/dates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(errorText || `Failed to send request: ${response.status}`);
    }

    return (await response.json()) as DateRequest;
  } catch (error) {
    console.error('Error creating date request:', error);
    throw error;
  }
}

export async function getDateRequests() {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dates`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch date requests: ${response.status}`);
    }

    return (await response.json()) as DateRequest[];
  } catch (error) {
    console.error('Error fetching date requests:', error);
    throw error;
  }
}

export async function updateDateRequestStatus(id: string, status: string) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/dates/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update date request: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating date request status:', error);
    throw error;
  }
}

export async function updateContent(content: any) {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error(`Failed to update content: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating content:', error);
    throw error;
  }
}
