import { getToken } from "./auth";
import type { DashboardData, LoginPayload, RegisterPayload, UserProfile } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const detail = data.detail;
    const msg = Array.isArray(detail)
      ? detail.map((d: { msg?: string }) => d.msg).join(", ")
      : typeof detail === "string"
        ? detail
        : data.message || "Request failed";
    throw new Error(msg);
  }
  return data as T;
}

export const api = {
  register: (payload: RegisterPayload) =>
    request<{ message: string; user_id: string }>("/api/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    request<{ access_token: string; token_type: string }>("/api/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getDashboardData: () =>
    request<DashboardData>("/api/dashboard-data", { method: "GET" }, true),

  getMe: () => request<UserProfile>("/api/me", { method: "GET" }, true),

  updateProfile: (phone_number: string) =>
    request<UserProfile>(
      "/api/profile",
      { method: "PATCH", body: JSON.stringify({ phone_number }) },
      true
    ),

  uploadCsv: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ message: string; rows: number }>(
      "/api/upload-csv",
      { method: "POST", body: form },
      true
    );
  },

  downloadReport: async () => {
    const token = getToken();
    const res = await fetch(`${API_URL}/api/report`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to download report");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "costcare_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  },
};
