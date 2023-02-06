export const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
export const atLeastOneUppercase = /[A-Z]/g; // capital letters from A to Z
export const atLeastOneLowercase = /[a-z]/g; // small letters from a to z
export const atLeastOneNumeric = /[0-9]/g; // numbers from 0 to 9
export const atLeastOneSpecialChar = /[#?!@$%^&*-]/g; // any of the special characters within the square brackets
export const eightCharsOrMore = /.{8,}/g; // eight characters or more
export const PASSWORDSTRENGTH = 5;
