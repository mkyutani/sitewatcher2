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
  op: string | null,
  dst: string | null,
  src: string | null,
  value: string | null,
};