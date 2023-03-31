type Rules = {
  label: string;
  name: string;
  isChecked: boolean;
}[];

type Availability = {
  name: string;
  label: string;
  description: string;
  isChecked: boolean;
}[];

type Convenience = {
  name: string;
  label: string;
  isChecked: boolean;
}[];

export type { Availability, Convenience, Rules };
