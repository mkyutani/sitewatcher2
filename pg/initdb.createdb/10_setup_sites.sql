drop table if exists sites;
create table sites (
  id serial not null,
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
  site integer not null,
  uri varchar(4096) not null,
  name varchar(256) not null,
  longName varchar(4096) not null,
  hash varchar(64) not null,
  status varchar(8) not null,
  mark varchar(8) not null,
  enabled boolean not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(site, uri)
);