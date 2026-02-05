export type Validator = (errorMessage: string) => (value: string) => string | true
export type LimitValidator = (errorMessage: string, limit: number) => (value: string) => string | true
export type FullValueValidator = <T extends {
  password: string;
}>(errorMessage: string) => (value: string, values: T) => string | true

export const textValidation: Validator = (errorMessage: string) => {
  return (value: string) =>
    !value || value?.toString().trim() == "" ? errorMessage : true;
};

export const textLimitValidation: LimitValidator = (errorMessage: string, limit: number) => {
  return (value: string) => (value?.length > limit ? errorMessage : true);
};

export const descLimitValidation: LimitValidator = (errorMessage: string, limit: number) => {
  return (value: string) => (value?.length > limit ? errorMessage : true);
};
export const emailValidation: Validator = (errorMessage: string) => {
  return (value: string) =>
    !value ||
      value?.match(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      )
      ? true
      : errorMessage;
};

export const passwordValidation: Validator = (errorMessage: string) => {
  return (value: string) => (value?.length >= 8 ? true : errorMessage);
};

export const confirmPasswordValidation: FullValueValidator = <T extends { password: string }>(errorMessage: string) => {
  return (value: string, values: T) =>
    values?.password == value ? true : errorMessage;
};

export const websiteValidation: Validator = (errorMessage: string) => {
  return (value: string) =>
    !value ||
      value?.match(
        /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[a-zA-Z0-9#?&%=._-]*)?$/
      )
      ? true
      : errorMessage;
};

export const phoneNumberValidation: Validator = (errorMessage: string) => {
  return (value: string) => {
    if (!value) return true;
    const phoneNumberPattern = /^[+]?[0-9]{10,15}$/;
    return phoneNumberPattern.test(value) ? true : errorMessage;
  };
};

export const floatValidation: Validator = (errorMessage: string) => {
  return (value: string) => {
    return !value || !isNaN(Number(value)) ? true : errorMessage;
  };
};

export const priceValidation: Validator = (errorMessage: string) => {
  return (value: string) => {
    return !value || (!isNaN(Number(value)) && Number(value) > -1) ? true : errorMessage;
  };
};
