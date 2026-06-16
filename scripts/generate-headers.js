#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const out = path.join(__dirname, '..', '_headers');
const creds = process.env.RACE_BASIC_AUTH;

if (!creds) {
  console.log('RACE_BASIC_AUTH not set — race folder will not be password protected');
  fs.writeFileSync(out, '');
  process.exit(0);
}

const headers = `/client/race
  Basic-Auth: ${creds}

/client/race/*
  Basic-Auth: ${creds}
`;

fs.writeFileSync(out, headers);
console.log('Wrote _headers with race folder basic auth');
