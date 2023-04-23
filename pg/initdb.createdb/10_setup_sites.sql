create table sites (
id serial primary key not null,
name varchar(256) not null,
source varchar(4096) not null,
type varchar(32) not null,
unique (name)
);