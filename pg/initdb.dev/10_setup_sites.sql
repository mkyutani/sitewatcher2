create table if not exists directory (
  id uuid default gen_random_uuid() not null,
  name varchar(256) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(name)
);

create table if not exists site (
  id uuid default gen_random_uuid() not null,
  directory uuid not null references directory on delete cascade,
  uri varchar(4096) not null,
  name varchar(256) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(uri)
);

create table if not exists exclusion (
  site uuid not null references site on delete cascade,
  number serial not null,
  key varchar(256) not null,
  pattern varchar(4096) not null,
  primary key(site, number)
);

create table if not exists resource (
  id uuid default gen_random_uuid() not null,
  uri varchar(4096) not null,
  site uuid not null references site on delete cascade,
  name varchar(4096) not null,
  tm timestamp not null,
  primary key(id),
  unique(uri, site)
);

create table if not exists resource_property (
  resource uuid not null references resource on delete cascade,
  key varchar(256) not null,
  value varchar(4096) not null,
  primary key(resource, key)
);

create table if not exists channel (
  id uuid default gen_random_uuid() not null,
  directory uuid not null references directory on delete cascade,
  name varchar(256) not null,
  primary key(id),
  unique(directory, name)
);

create table if not exists format (
  channel uuid not null references channel on delete cascade,
  site uuid not null references site on delete cascade,
  format varchar(4096) not null,
  primary key(channel, site)
);

create table if not exists history (
  channel uuid not null references channel on delete cascade,
  resource uuid not null references resource on delete cascade,
  tm timestamp not null,
  primary key(channel, resource)
);

create table if not exists directory_metadata (
  id uuid default gen_random_uuid() not null,
  directory uuid not null references directory on delete cascade,
  key varchar(256) not null,
  value varchar(4096) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id)
);

create table if not exists site_metadata (
  id uuid default gen_random_uuid() not null,
  site uuid not null references site on delete cascade,
  key varchar(256) not null,
  value varchar(4096) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id)
);