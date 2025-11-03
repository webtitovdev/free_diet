#!/usr/bin/env node

/**
 * Скрипт для проверки наличия всех обязательных переменных окружения
 *
 * Использование:
 * node scripts/check-env.js
 *
 * Скрипт проверяет наличие всех обязательных переменных
 * и выводит понятные сообщения об ошибках
 */

const fs = require('fs')
const path = require('path')

// Список обязательных переменных окружения
const REQUIRED_ENV_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'OPENROUTER_API_KEY',
  'BLOB_READ_WRITE_TOKEN',
  'RESEND_API_KEY',
]

// Опциональные переменные (показываем предупреждение, но не падаем)
const OPTIONAL_ENV_VARS = [
  'USDA_API_KEY', // Для USDA FoodData API (опционально)
]

function checkEnvVars() {
  console.log('🔍 Проверка переменных окружения...\n')

  const envPath = path.join(process.cwd(), '.env')
  const envExamplePath = path.join(process.cwd(), '.env.example')

  // Проверяем наличие .env файла
  if (!fs.existsSync(envPath)) {
    console.error('❌ Файл .env не найден!')
    if (fs.existsSync(envExamplePath)) {
      console.log('💡 Скопируйте .env.example в .env и заполните значения:')
      console.log('   cp .env.example .env\n')
    }
    process.exit(1)
  }

  // Загружаем переменные из .env
  require('dotenv').config()

  let hasErrors = false
  const missingVars = []

  // Проверяем обязательные переменные
  console.log('✅ Обязательные переменные:')
  REQUIRED_ENV_VARS.forEach((varName) => {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      console.log(`   ❌ ${varName} - отсутствует`)
      missingVars.push(varName)
      hasErrors = true
    } else {
      console.log(`   ✅ ${varName} - установлена`)
    }
  })

  // Проверяем опциональные переменные
  console.log('\n📋 Опциональные переменные:')
  OPTIONAL_ENV_VARS.forEach((varName) => {
    const value = process.env[varName]
    if (!value || value.trim() === '') {
      console.log(`   ⚠️  ${varName} - не установлена (опционально)`)
    } else {
      console.log(`   ✅ ${varName} - установлена`)
    }
  })

  console.log('\n' + '='.repeat(50))

  if (hasErrors) {
    console.error('\n❌ Ошибка: не все обязательные переменные заполнены!\n')
    console.log('Отсутствующие переменные:')
    missingVars.forEach((varName) => {
      console.log(`  - ${varName}`)
    })
    console.log('\n💡 Заполните эти переменные в файле .env\n')
    process.exit(1)
  } else {
    console.log('\n✅ Все обязательные переменные окружения установлены!\n')
    process.exit(0)
  }
}

// Запускаем проверку
checkEnvVars()
