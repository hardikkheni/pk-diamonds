const moneyFormat = (num) =>
  num.toLocaleString('en-US', { style: 'currency', currency: 'INR' });

const round = (val, pers) =>
  Math.round(((val ? parseFloat(val) : 0) + Number.EPSILON) * 10 ** pers) /
  10 ** pers;

const calcTotal = (row, level = 'total') => {
  if (!row.weight || !row.currency || !row.currency_in_rupee || !row.price)
    return 0;
  let total = row.weight * row.currency_in_rupee * row.price;
  if (level === 'subtotal') return round(total, 2);
  if (row.discount) total -= total * (row.discount / 100);
  if (level === 'discount') return round(total, 2);
  if (row.brokerage) total += total * (row.brokerage / 100);
  if (level === 'brokerage' || level === 'total') return round(total, 2);
};

module.exports = {
  moneyFormat,
  round,
  calcTotal,
};
