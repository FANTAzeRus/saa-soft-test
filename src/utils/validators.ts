export function labelValidator(value:string) {
  return !value ? true : value.length <= 50;
}

export function loginValidator(value:string) {
  return value && value.length <= 100;
}

export function passwordValidator(value:string) {
  return value && value.length <= 100;
}