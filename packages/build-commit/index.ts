#!/usr/bin/env node

/**
 * export a command to one step commit
 */
const { spawn, execSync } = require('child_process')
execSync('git add .')
spawn('git-cz', [], {
  stdio: 'inherit'
})
