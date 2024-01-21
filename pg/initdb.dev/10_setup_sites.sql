create table if not exists directory (
  id uuid default gen_random_uuid() not null,
  name varchar(256) not null,
  metadata varchar(4096) not null,
  enabled boolean not null,
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
  metadata varchar(4096) not null,
  enabled boolean not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(uri)
);

create table if not exists resource (
  uri varchar(4096) not null,
  site uuid not null references site on delete cascade,
  name varchar(256) not null,
  longName varchar(4096) not null,
  created timestamp not null,
  primary key(uri, site)
);

create table if not exists directory_metadata (
  directory uuid not null references directory on delete cascade,
  key varchar(256) not null,
  value varchar(4096) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(directory, key)
);

create table if not exists site_metadata (
  site uuid not null references site on delete cascade,
  key varchar(256) not null,
  value varchar(4096) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(site, key)
);