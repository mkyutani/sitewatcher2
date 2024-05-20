export type SiteParam = {
  uri: string | null,
  name: string | null,
  directory: string | null
};

export type SiteResourceParam = {
  uri: string,
  properties: any,
};

export type SiteRuleParam = {
  weight: number | null,
  value: string | null,
};