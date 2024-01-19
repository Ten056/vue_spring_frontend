import http from "../http-common";

export const getAll = () => {
  return http.get("/sample");
};

export const findByUserName = (userName: string) => {
  return http.get(`/sample?userName=${userName}`);
};
