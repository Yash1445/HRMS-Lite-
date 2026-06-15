import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export const employeeService = {
  list: async () => (await api.get("/employees")).data.employees,
  create: async (payload) => (await api.post("/employees", payload)).data.employee,
  remove: async (id) => (await api.delete(`/employees/${id}`)).data,
};

export const attendanceService = {
  list: async (date) => {
    const params = date ? { date } : {};
    return (await api.get("/attendance", { params })).data.attendance;
  },
  create: async (payload) => (await api.post("/attendance", payload)).data.attendance,
  byEmployee: async (employeeId) => (await api.get(`/attendance/${employeeId}`)).data,
};

export const dashboardService = {
  summary: async () => (await api.get("/dashboard")).data,
};

export default api;
