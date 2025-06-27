//write a function to format a string to capitalize the first letter of each word
export const capitalizeWords = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

//write a function to format a string to lowercase
export const lowercaseString = (str: string) => {
  return str.toLowerCase();
};

//write a function to format a string to uppercase