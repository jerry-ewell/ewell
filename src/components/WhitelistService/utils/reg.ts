export const USER_ADDRESS_REG = /^[,a-zA-Z0-9]+$/;
const P_N_REG = /^[0-9]+.?[0-9]*$/;

export function isValidNumber(n: string) {
  if (n.includes('-')) return false;
  return P_N_REG.test(n);
}
