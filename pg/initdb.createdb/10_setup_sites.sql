create table sites (
  id serial primary key not null,
  name varchar(256) not null,
  source varchar(4096) not null,
  type varchar(32) not null,
  lastUpdated timestamp not null,
  unique(name)
);

create table siteLinks (
  id serial primary key not null,
  site integer references sites(id),
  name varchar(256) not null,
  longName varchar(4096) not null,
  link varchar(4096) not null,
  lastUpdated timestamp not null,
  unique(link)  
);