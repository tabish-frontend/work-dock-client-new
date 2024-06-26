import Axios from "src/config/axios";

class EmployeesApi {
  async getAllEmployees(
    account_status: string | string[] | undefined = "active",
    fields = ""
  ) {
    const response = await Axios.get(
      `/employees?account_status=${account_status}&fields=${fields}`
    );

    return response.data;
  }

  async getEmployee(username: string | string[] | undefined) {
    const response = await Axios.get(`/employees/${username}`);

    return response.data;
  }

  async createEmployee(body: object) {
    const response = await Axios.post(`/employees`, body);

    return response;
  }

  async updateEmployee(username: string, body: object) {
    const response = await Axios.patch(`/employees/${username}`, body);

    return response.data;
  }

  async deleteEmployee(username: string){
    const response = await Axios.delete(`/employees/${username}`);
    return response.data
  }
}

export const employeesApi = new EmployeesApi();
