drop table if exists directories;
create table directories (
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

drop table if exists directory_sites;
create table directory_sites (
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

drop table if exists sites;
create table sites (
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

drop table if exists resources;
create table resources (
  site uuid references sites on delete cascade,
  uri varchar(4096) not null,
  name varchar(256) not null,
  longName varchar(4096) not null,
  created timestamp not null,
  primary key(site, uri)
);

drop table if exists channels;
create table channels (
  id uuid default gen_random_uuid() not null,
  name varchar(256) not null,
  enabled boolean not null,
  created timestamp not null,
  updated timestamp not null,
  referred timestamp not null,
  primary key(id),
  unique(name)
);

drop table if exists channel_sites;
create table channel_sites (
  channel uuid not null,
  site uuid not null,
  primary key(channel, site)
);

drop table if exists channel_resources;
create table channel_resources (
  id uuid default gen_random_uuid() not null,
  channel uuid not null,
  site_uri varchar(4096) not null,
  site_name varchar(256) not null,
  uri varchar(4096) not null,
  name varchar(256) not null,
  longName varchar(4096) not null,
  primary key(id)
);