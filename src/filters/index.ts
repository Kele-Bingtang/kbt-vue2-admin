// Filter for table status
export const tableStatusFilter = (status: string) => {
  const statusMap: { [key: string]: string } = {
    Enable: "success",
    Deleted: "info",
    Disable: "danger",
  };
  return statusMap[status];
};

// Filter to uppercase the first character
export const uppercaseFirstChar = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
