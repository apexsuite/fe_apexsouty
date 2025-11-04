export const INPUT_TYPES = {
  Text: 'text',
  Select: 'select',
} as const;

export type Types = (typeof INPUT_TYPES)[keyof typeof INPUT_TYPES];
export interface SelectOption {
  value: string;
  label: string;
}

export interface FilterInputs {
  type: Types;
  name: string;
  label: string;
  placeholder?: string;
  options?: SelectOption[];
}
/**
 * @param inputs - The inputs for the filters
 * @param path - The path to navigate to when the create button is clicked
 */
export interface CustomFilterProps {
  inputs: FilterInputs[];
  path?: string;
}

export type FilterFormData = Record<string, string>;
