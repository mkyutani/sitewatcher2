# sitewatcher2

## Architecture and design

* [Design](design.md)

## Backup and restore

### Backup database

```sh
#
# Backup database to sw2pg_dump.tar
#
sudo docker exec -it sw2pg sh -c 'pg_dump -Ft sitewatcher > sw2pg_dump.tar'
```

### Restore database

```sh
#
# Prepare environment for dev or production
#
sudo ./init.sh dev

#
# Start postgres server
#
sudo docker compose up -d

#
# Copy archive to /app in sw2pg container
#
sudo cp sw2pg_dump.tar volumes/pg/home

#
# Restore database from sw2pg_dump.tar
#
sudo docker exec -it sw2pg sh -c 'pg_restore -c -Ft -d sitewatcher sw2pg_dump.tar'
```
