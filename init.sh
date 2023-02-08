#!/usr/bin/env sh

create_directory() {
    local dir=$1
    local mode=$2
    if [ ! -e "${dir}" ]; then
        mkdir -p "${dir}"
        chmod "${mode}" "${dir}"
        echo -n " ${dir}/"
        CREATED=1
    fi
}

ENV_FILE=.env
echo -n "Preparing ${ENV_FILE} ..."
if [ -e ${ENV_FILE} ]; then
    echo " already exists."
else
    touch ${ENV_FILE}
    echo "USER=$(id -un)" >>${ENV_FILE}
    echo "GROUP=$(id -gn)" >>${ENV_FILE}
    echo "UID=$(id -u)" >>${ENV_FILE}
    echo "GID=$(id -g)" >>${ENV_FILE}
    echo "LOGS=/logs" >>${ENV_FILE}

    echo "PG_USER=$(id -un)" >>${ENV_FILE}
    echo "PG_PASSWORD=postgres" >>${ENV_FILE}
    echo "PG_DATABASE=sitewatcher" >>${ENV_FILE}
    echo "PG_PORT=5432" >>${ENV_FILE}

    echo "API_PORT=80" >>${ENV_FILE}

    echo " created."
fi

SITE_DIR=site
echo -n "Creating site directories ..."
CREATED=0
create_directory "${SITE_DIR}" 775
create_directory "${SITE_DIR}/client" 775
create_directory "${SITE_DIR}/api" 775
create_directory "${SITE_DIR}/data" 775
create_directory "${SITE_DIR}/pg" 775
create_directory "${SITE_DIR}/pg/data" 775
create_directory "${SITE_DIR}/pg/initdb" 775
create_directory "${SITE_DIR}/pg/home" 775
create_directory "${SITE_DIR}/logs" 775
if [ ${CREATED} = 1 ]; then
    echo " created."
else
    echo " already exist."
fi