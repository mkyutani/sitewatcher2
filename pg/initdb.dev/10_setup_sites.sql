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

create table if not exists resource (
  id uuid default gen_random_uuid() not null,
  uri varchar(4096) not null,
  site uuid not null references site on delete cascade,
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
  name varchar(256) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(name)
);

create table if not exists channel_directory (
  channel uuid not null references channel on delete cascade,
  directory uuid not null references directory on delete cascade,
  title varchar(4096) not null,
  description varchar(4096) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(channel, directory)
);

create table if not exists channel_site (
  channel uuid not null references channel on delete cascade,
  site uuid not null references site on delete cascade,
  title varchar(4096) not null,
  description varchar(4096) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(channel, site)
);

create table if not exists channel_device (
  channel uuid not null references channel on delete cascade,
  name varchar(256) not null,
  interface varchar(256) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(channel, name)
);

create table if not exists channel_history (
  channel uuid not null references channel on delete cascade,
  uri varchar(4096) not null,
  title varchar(4096) not null,
  description varchar(4096) not null,
  source varchar(4096) not null,
  tm timestamp not null,
  primary key(channel, uri)
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