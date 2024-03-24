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

create table if not exists site_resource (
  id serial not null,
  uri varchar(4096) not null,
  site uuid not null references site on delete cascade,
  name varchar(4096) not null,
  reason varchar(256) not null,
  section1 varchar(4096),
  section2 varchar(4096),
  section3 varchar(4096),
  section4 varchar(4096),
  section5 varchar(4096),
  section6 varchar(4096),
  tm timestamp not null,
  primary key(id)
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