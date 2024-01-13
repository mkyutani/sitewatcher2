create table if not exists directories (
  id uuid default gen_random_uuid() not null,
  uri varchar(4096) not null,
  name varchar(256) not null,
  type varchar(32) not null,
  enabled boolean not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(uri)
);

create table if not exists directory_sites (
  id uuid default gen_random_uuid() not null,
  uri varchar(4096) not null,
  name varchar(256) not null,
  longName varchar(4096) not null,
  enabled boolean not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(uri)
);

create table if not exists sites (
  id uuid default gen_random_uuid() not null,
  uri varchar(4096) not null,
  name varchar(256) not null,
  type varchar(32) not null,
  enabled boolean not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(uri)
);

create table if not exists resources (
  site uuid references sites on delete cascade,
  uri varchar(4096) not null,
  name varchar(256) not null,
  longName varchar(4096) not null,
  created timestamp not null,
  primary key(site, uri)
);

create table if not exists channels (
  id uuid default gen_random_uuid() not null,
  name varchar(256) not null,
  enabled boolean not null,
  created timestamp not null,
  updated timestamp not null,
  referred timestamp not null,
  primary key(id),
  unique(name)
);

create table if not exists channel_sites (
  channel uuid not null,
  site uuid not null,
  primary key(channel, site)
);

create table if not exists channel_resources (
  id uuid default gen_random_uuid() not null,
  channel uuid not null,
  site_uri varchar(4096) not null,
  site_name varchar(256) not null,
  uri varchar(4096) not null,
  name varchar(256) not null,
  longName varchar(4096) not null,
  primary key(id)
);

create table if not exists tasks (
  id uuid default gen_random_uuid() not null,
  target uuid not null,
  type varchar(32) not null,
  method varchar(32) not null,
  status varchar(32) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(target)
);