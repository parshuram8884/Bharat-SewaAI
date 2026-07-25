export const PaymentMode = {
  DBT: 'dbt',
  BANK_TRANSFER: 'bank-transfer',
  SCHOLARSHIP_CREDIT: 'scholarship-credit',
  SUBSIDY_CREDIT: 'subsidy-credit',
  VOUCHER: 'voucher',
  GRANT: 'grant'
};

export const PaymentModeLabels = {
  [PaymentMode.DBT]: 'Direct Benefit Transfer (DBT)',
  [PaymentMode.BANK_TRANSFER]: 'Bank Transfer',
  [PaymentMode.SCHOLARSHIP_CREDIT]: 'Scholarship Credit',
  [PaymentMode.SUBSIDY_CREDIT]: 'Subsidy Credit',
  [PaymentMode.VOUCHER]: 'Digital Voucher',
  [PaymentMode.GRANT]: 'Direct Grant'
};
