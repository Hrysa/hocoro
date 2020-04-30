# hocoro

[![npm version](https://badgen.net/npm/v/hocoro)](https://www.npmjs.com/package/hocoro) [![codecov](https://codecov.io/gh/Hrysa/hocoro/branch/master/graph/badge.svg)](https://codecov.io/gh/Hrysa/hocoro) [![Build Status](https://travis-ci.com/Hrysa/hocoro.svg?branch=master)](https://travis-ci.com/Hrysa/hocoro)

simple data-mock server written with nodejs

## Installation

```shell
npm i hocoro -g

# or
yarn global add hocoro
```

> and make sure you have right `PATH` environment

## Usage

hocoro will watch all yml file in work directory (default is "`.`")

run application with command blow

```shell
hocoro CONFIG_FILE_DIR

# specified port
hocoro -p 8080 CONFIG_FILE_DIR
```

you can see the request information in terminal or visit url using `http://HOSTNAME:PORT/log/SCOPE`

> scope is your config file name (without yml suffix).

## Configuration

see [examples](./examples/)
