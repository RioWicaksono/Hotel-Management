#!/usr/bin/env tsx

/**
 * QC Validation Script
 * Run: npm run qc:validate
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
}

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function check(label: string, pass: boolean, details = '') {
  log(`${pass ? '✅' : '❌'} ${label}${details ? `: ${details}` : ''}`, pass ? 'green' : 'red')
  return pass
}

async function runQC() {
  log('\n🔍 QC VALIDATION - Hotel Management System\n', 'blue')
  log('═'.repeat(50), 'blue')

  const results: boolean[] = []

  // 1. Check .env exists
  results.push(check('.env file exists', existsSync(resolve('.env'))))

  // 2. Check DATABASE_URL is set
  try {
    const envContent = readFileSync(resolve('.env'), 'utf-8')
    const hasDbUrl = envContent.includes('DATABASE_URL=') && !envContent.includes('user:password')
    results.push(check('DATABASE_URL configured', hasDbUrl))
  } catch {
    results.push(check('DATABASE_URL configured', false))
  }

  // 3. Check Prisma schema
  try {
    execSync('npx prisma validate', { stdio: 'pipe' })
    results.push(check('Prisma schema valid', true))
  } catch {
    results.push(check('Prisma schema valid', false))
  }

  // 4. Check TypeScript compilation
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' })
    results.push(check('TypeScript compilation', true))
  } catch {
    results.push(check('TypeScript compilation', false))
  }

  // 5. Check ESLint
  try {
    execSync('npm run lint', { stdio: 'pipe' })
    results.push(check('ESLint passed', true))
  } catch {
    results.push(check('ESLint passed', false))
  }

  // 6. Check build
  try {
    execSync('npm run build', { stdio: 'pipe' })
    results.push(check('Build successful', true))
  } catch {
    results.push(check('Build successful', false))
  }

  // Summary
  log('\n' + '═'.repeat(50), 'blue')
  const passed = results.filter(Boolean).length
  const total = results.length

  if (passed === total) {
    log(`🎉 ALL CHECKS PASSED (${passed}/${total})`, 'green')
  } else {
    log(`⚠️  ${total - passed} checks failed (${passed}/${total})`, 'yellow')
  }

  process.exit(passed === total ? 0 : 1)
}

runQC().catch(console.error)
