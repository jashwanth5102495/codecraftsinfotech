const API_BASE_URL = `${(import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000')}/api`;

export interface Project {
  id: number;
  project_id: string;
  title: string;
  description?: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  project_type: string;
  status: 'project_confirmed' | 'designing_phase' | 'development_phase' | 'pre_production_testing' | 'final_testing' | 'final_confirmation' | 'project_completed';
  progress: number;
  estimated_duration?: number;
  start_date?: string;
  end_date?: string;
  requirements?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectStats {
  total: number;
  pending: number;
  in_progress: number;
  completed: number;
  on_hold: number;
  avg_progress: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    username: string;
    role: string;
  };
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    requireAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
      };

      if (requireAuth) {
        const token = this.getAuthToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers,
        ...options,
      });

      const data = await response.json();
      
      // Handle unauthorized responses
      if (response.status === 401) {
        this.removeAuthToken();
        return {
          success: false,
          error: 'Authentication required',
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async logout(): Promise<void> {
    this.removeAuthToken();
    // Optional: call backend logout endpoint
    await this.request('/auth/logout', { method: 'POST' });
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    }, true);
  }

  async verifyToken(): Promise<ApiResponse<{ valid: boolean }>> {
    return this.request<{ valid: boolean }>('/auth/verify', {
      method: 'GET',
    }, true);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Project methods (public endpoints don't require auth, admin endpoints do)
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return this.request<Project[]>('/projects');
  }

  async getProjectStats(): Promise<ApiResponse<ProjectStats>> {
    return this.request<ProjectStats>('/projects/stats');
  }

  async getProject(id: number): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Project>> {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    }, true); // Requires authentication
  }

  async updateProject(id: number, project: Partial<Project>): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    }, true); // Requires authentication
  }

  async deleteProject(id: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/projects/${id}`, {
      method: 'DELETE',
    }, true); // Requires authentication
  }

  async trackProject(projectId: string): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/projects/track/${projectId}`);
  }

  // Faculty and referral code methods
  async validateReferralCode(referralCode: string, coursePrice: number): Promise<ApiResponse<any>> {
    return this.request<any>('/faculty/validate-referral', {
      method: 'POST',
      body: JSON.stringify({ referralCode, coursePrice }),
    });
  }

  async createPaymentWithReferral(paymentData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  }

  // Purchases endpoints
  async createPurchase(purchase: any): Promise<ApiResponse<any>> {
    return this.request<any>('/purchases', {
      method: 'POST',
      body: JSON.stringify(purchase),
    });
  }

  async getPurchases(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/purchases', { method: 'GET' }, true);
  }

  // Referral codes (new backend endpoints)
  async getReferrals(): Promise<ApiResponse<any[]>> {
    const primary = await this.request<any[]>('/referrals', { method: 'GET' }, true);
    if (!primary.success && (primary.error||'').toLowerCase().includes('not found')) {
      return this.request<any[]>('/referral-codes', { method: 'GET' }, true);
    }
    return primary;
  }

  async createReferral(payload: { agentName: string; email: string; code: string; discountPercent: number }): Promise<ApiResponse<any>> {
    const primary = await this.request<any>('/referrals', { method: 'POST', body: JSON.stringify(payload) }, true);
    if (!primary.success && (primary.error||'').toLowerCase().includes('not found')) {
      return this.request<any>('/referral-codes', { method: 'POST', body: JSON.stringify(payload) }, true);
    }
    return primary;
  }

  async deleteReferral(code: string): Promise<ApiResponse<any>> {
    const primary = await this.request<any>(`/referrals/${encodeURIComponent(code)}`, { method: 'DELETE' }, true);
    if (!primary.success && (primary.error||'').toLowerCase().includes('not found')) {
      return this.request<any>(`/referral-codes/${encodeURIComponent(code)}`, { method: 'DELETE' }, true);
    }
    return primary;
  }

  async validateReferral(code: string): Promise<ApiResponse<{ valid: boolean; discountPercent?: number; agentName?: string }>> {
    const primary = await this.request<{ valid: boolean; discountPercent?: number; agentName?: string }>(
      '/referrals/validate', { method: 'POST', body: JSON.stringify({ code }) }
    );
    if (!primary.success && (primary.error||'').toLowerCase().includes('not found')) {
      return this.request<{ valid: boolean; discountPercent?: number; agentName?: string }>(
        '/referral-codes/validate', { method: 'POST', body: JSON.stringify({ code }) }
      );
    }
    return primary;
  }
}

export default new ApiService();