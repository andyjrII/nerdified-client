export function unformatCurrency(currencyString: string): number {
  // Step 1: Remove the currency symbol
  const cleanedString = currencyString.replace('₦', '');

  // Step 2: Remove commas
  const noCommaString = cleanedString.replace(/,/g, '');

  // Step 3: Parse to float
  const result = parseFloat(noCommaString);

  return result;
}
