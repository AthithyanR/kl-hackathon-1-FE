/* eslint-disable no-useless-escape */

export const checkEmail = (value) => {
  if (!value) {
    return [[], true];
  }
  const regEx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  const result = (value || '').replace(/\s/g, '').split(/,|;/);
  const emails = [];
  let hasError = false;
  result.forEach((i) => {
    const em = i.trim();
    if (regEx.test(em)) {
      emails.push(i);
    } else {
      hasError = true;
    }
  });

  return [emails, hasError];
};
