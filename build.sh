#!/usr/bin/env bash

pushd "$(dirname "$0")"

set -e

case $1 in
  plain|debug|debugoptimized|release|minsize)
    BUILDTYPE=$1
    shift
    ;;
  *)
    BUILDTYPE=release
    ;;
esac

export CPLUS_INCLUDE_PATH=$(realpath include)
BUILDDIR=build/${BUILDTYPE}

if ! hash meson 2>/dev/null && [ -x ${HOME}/.local/bin/meson ]
then
  export PATH=${PATH}:${HOME}/.local/bin
fi

if [ -f ${BUILDDIR}/build.ninja ]
then
  meson configure ${BUILDDIR} -Dbuildtype=${BUILDTYPE} -Dprefix=${INSTALL_PREFIX:-/usr/local} -Dblas=true -Dopenblas=true "$@"
else
  meson ${BUILDDIR} --cross-file wasm.txt --buildtype ${BUILDTYPE} --prefix ${INSTALL_PREFIX:-/usr/local} -Dblas=true -Dopenblas=true "$@" --default-library static
fi

cd ${BUILDDIR}

NINJA=$(awk '/ninja/ {ninja=$4} END {print ninja}' meson-logs/meson-log.txt)

if [ -n "${INSTALL_PREFIX}" ]
then
  ${NINJA} install
else
  ${NINJA}
fi

popd
