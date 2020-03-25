export const pick = (from: string) => {
  return from.charAt(Math.floor(Math.random() * from.length));
};

export const str = (
  len: number,
  alpha: boolean = true,
  numbers: boolean = true,
  special: boolean = false
) => {
  let output = '';
  let domain = '';
  if(alpha)
    domain += 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  if(numbers)
    domain += '0123456789';
  if(special)
    domain += '!@#$%^&';
  for(let i = 0; i < len; i++)
    output += pick(domain);
  return output;
};
