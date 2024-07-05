export const themeColor = {
  CIS: "#0b7367",
  math: "#11698c",
  physics: "#614495",
  statistics: "#a63738",
  other: "#E5AE3A",
  institutional_navy: "#002856",
  institutional_green: "#0b7367",
  grey: "#5B6770",
};
export const mediaQuery = window.matchMedia("(max-width: 820px)");

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const studentFieldReadOnly = {
  id: true,
};
export const studentFieldTypes = {
  id: "text",
  name: "text",
  major: "text",
  email: "email",
  subject: "select",
  year: "select",
};
export const studentFieldOptions = {
  subject: ["Calculus III", "Mathematics", "Physics"],
  year: ["Freshman", "Sophomore", "Junior", "Senior"],
};

export function variants() {
  return [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "dark",
    "light",
    "link",
  ];
}

export default {
  themeColor,
  mediaQuery,
  apiBaseUrl,
  studentFieldReadOnly,
  studentFieldTypes,
  studentFieldOptions,
  variants,
};
