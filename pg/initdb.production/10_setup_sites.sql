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

create table if not exists rule_category (
  id int not null,
  name varchar(256) not null,
  description varchar(4096) not null,
  primary key(id),
  unique(name)
);
insert into rule_category (id, name, description)
values
  (1, 'include', 'includes site resources'),
  (2, 'exclude', 'excludes site resources'),
  (3, 'property_template', 'site resource property template');

create table if not exists directory_rule (
  id uuid default gen_random_uuid() not null,
  directory uuid not null references directory on delete cascade,
  category int not null references rule_category on delete cascade,
  weight int not null,
  op varchar(256),
  src varchar(256),
  dst varchar(256),
  value varchar(4096),
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(directory, category, tag)
);

create table if not exists site_rule (
  id uuid default gen_random_uuid() not null,
  site uuid not null references site on delete cascade,
  category int not null references rule_category on delete cascade,
  weight int not null,
  op varchar(256),
  src varchar(256),
  dst varchar(256),
  value varchar(4096),
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(site, category, weight)
);

create table if not exists resource (
  id uuid default gen_random_uuid() not null,
  uri varchar(4096) not null,
  site uuid not null references site on delete cascade,
  timestamp char(20) not null,
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
  priority char(24) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(channel, directory)
);

create table if not exists channel_site (
  channel uuid not null references channel on delete cascade,
  site uuid not null references site on delete cascade,
  title varchar(4096) not null,
  description varchar(4096) not null,
  priority char(24) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(channel, site)
);

create table if not exists channel_device (
  id uuid default gen_random_uuid() not null,
  channel uuid not null references channel on delete cascade,
  name varchar(256) not null,
  interface varchar(256) not null,
  apikey varchar(256) not null,
  tag varchar(256) not null,
  template varchar(4096) not null,
  created timestamp not null,
  updated timestamp not null,
  primary key(id),
  unique(channel, name)
);

create table if not exists channel_device_log (
  device uuid not null references channel_device on delete cascade,
  timestamp char(20) not null,
  primary key(device, timestamp)
);

create table if not exists channel_history (
  channel uuid not null references channel on delete cascade,
  resource uuid not null references resource on delete cascade,
  uri varchar(4096) not null,
  timestamp char(20) not null,
  primary key(channel, uri)
);