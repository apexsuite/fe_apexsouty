export const STATIC_VENDOR_COLUMNS = [
  {
    name: 'ASIN/UPC',
    value: 'asin/upc',
    required: true,
  },
  {
    name: 'Price',
    value: 'price',
    required: true,
  },
  {
    name: 'Name',
    value: 'name',
    required: true,
  },
  {
    name: 'SKU',
    value: 'sku',
    required: false,
  },
  {
    name: 'URL',
    value: 'url',
    required: false,
  },
  {
    name: 'Brand',
    value: 'brand',
    required: false,
  },
  {
    name: 'Category',
    value: 'category',
    required: false,
  },
] as const;

export type TStaticVendorColumns = typeof STATIC_VENDOR_COLUMNS;
