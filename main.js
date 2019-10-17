#!/usr/bin/env node
"use strict";

const getData = require("./getdata");
const commander = require("commander");
const program = new commander.Command();
const { description, version } = require("./package.json");

program
  .description(description)
  .version(version, "-v, --version", "show version number")

program
  .command("search <name>")
  .description("sqlite3 select test")
  .action((name) => {
    getData(name);
  });

program.parse(process.argv);
