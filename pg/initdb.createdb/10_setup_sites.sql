drop table if exists sites;
create table sites (
  id serial not null,
  name varchar(256) not null,
  source varchar(4096) not null,
  type varchar(32) not null,
  enabled boolean not null,
  lastUpdated timestamp not null,
  primary key(id),
  unique(name)
);

drop table if exists resources;
create table resources (
  site integer not null,
  uri varchar(4096) not null,
  name varchar(256) not null,
  longName varchar(4096) not null,
  enabled boolean not null,
  lastUpdated timestamp not null,
  primary key(site, uri)
);