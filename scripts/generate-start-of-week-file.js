#! /usr/bin/env node

const fs = require('fs');
const weekStart = require('weekstart');

const locals = require('../src/i18n/locales.json');

const startOfWeek = locals.reduce((acc, cv) => {
  const day = weekStart.getWeekStartByLocale(cv);

  return Object.assign(acc, { [cv]: day });
}, {});

// manual override
// https://inindca.atlassian.net/browse/COMUI-447?focusedCommentId=1191073
startOfWeek['zh-cn'] = 1;

fs.writeFileSync(
  __dirname + '/../src/i18n/start-of-week.json',
  JSON.stringify(startOfWeek, null, 2)
);
