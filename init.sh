#!/usr/bin/env sh

create_directory() {
    local dir=$1
    local mode=$2
    local user=$3
    local group=$4
    if [ ! -e "${dir}" ]; then
        mkdir "${dir}" -m "${mode}"
        chown "${user}:${group}" "${dir}"
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
    echo "LOGS=/logs" >>${ENV_FILE}

    echo "PG_USER=postgres" >>${ENV_FILE}
    echo "PG_GROUP=postgres" >>${ENV_FILE}
    echo "PG_PASSWORD=postgres" >>${ENV_FILE}
    echo "PG_SERVER=pg" >>${ENV_FILE}
    echo "PG_DATABASE=sitewatcher" >>${ENV_FILE}
    echo "PG_PORT=5432" >>${ENV_FILE}

    echo "API_EX_PORT=3000" >>${ENV_FILE}
    echo "API_PORT=3000" >>${ENV_FILE}

    echo " created."
fi

USER=$(id -un)
GROUP=$(id -gn)

SITE_DIR=site
echo -n "Creating site directories ..."
CREATED=0
create_directory "${SITE_DIR}" 775 ${USER} ${GROUP}
create_directory "${SITE_DIR}/api" 775 node node
create_directory "${SITE_DIR}/api/logs" 775 node node
create_directory "${SITE_DIR}/pg" 775 postgres postgres
create_directory "${SITE_DIR}/pg/data" 775 postgres postgres
create_directory "${SITE_DIR}/pg/initdb" 775 postgres postgres
if [ ${CREATED} = 1 ]; then
    echo " created."
else
    echo " already exist."
fi

echo -n "Creating simbolic links to ${ENV_FILE} ..."
cd api && ln -s ../${ENV_FILE} ./${ENV_FILE} && cd ..
echo " done"