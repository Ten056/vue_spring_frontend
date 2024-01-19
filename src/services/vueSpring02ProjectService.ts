import http from "../http-common";
import { User } from "../type";

export const createUser = (user: User) => {
  return http.post(`/api/users`, user)
} 

export const getAll = () => {
  return http.get("/api/users");
};

export const findByUserId = (userId: number) => {
  return http.get(`/api/users/${userId}`);
};

export const updateUser = (user: User, userId: number) => {
  console.log(user)
  return http.put(`api/users/${userId}`, user);
}

export const deleteUser = (userId: number) => {
  return http.delete(`api/users/${userId}`);
}
