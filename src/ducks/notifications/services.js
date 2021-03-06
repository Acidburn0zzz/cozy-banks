import logger from 'cozy-logger'
import { initTranslation } from 'cozy-ui/react/I18n/translation'
import {
  BalanceLower,
  TransactionGreater,
  HealthBillLinked
} from 'ducks/notifications'
import { BankAccount } from 'models'

const log = logger.namespace('notification-service')

const lang = process.env.COZY_LOCALE || 'en'
const dictRequire = lang => require(`../../locales/${lang}`)
const translation = initTranslation(lang, dictRequire)
const t = translation.t.bind(translation)

const configKeys = {
  BalanceLower: 'balanceLower',
  TransactionGreater: 'transactionGreater',
  HealthBillLinked: 'healthBillLinked'
}

const notificationClasses = [BalanceLower, TransactionGreater, HealthBillLinked]

const fetchTransactionAccounts = async transactions => {
  const accountsIds = Array.from(new Set(transactions.map(x => x.account)))
  const accounts = await BankAccount.getAll(accountsIds)
  const existingAccountIds = new Set(accounts.map(x => x._Id))
  const absentAccountIds = accountsIds.filter(_id =>
    existingAccountIds.has(_id)
  )
  const delta = accountsIds.length - accounts.length
  if (delta) {
    log('warn', delta + ' accounts do not exist')
    log('warn', JSON.stringify(absentAccountIds))
  }

  return accounts
}

const getClassConfig = (Klass, config) =>
  config.notifications[configKeys[Klass.name]]

const getEnabledNotificationClasses = config => {
  return notificationClasses.filter(Klass => {
    const klassConfig = getClassConfig(Klass, config)
    const enabled = klassConfig && klassConfig.enabled
    log('info', `${Klass.name} is ${enabled ? '' : 'not'} enabled`)
    return enabled
  })
}

export const sendNotifications = async (config, transactions, cozyClient) => {
  const enabledNotificationClasses = getEnabledNotificationClasses(config)
  const accounts = await fetchTransactionAccounts(transactions)
  log(
    'info',
    `${transactions.length} new transactions on ${accounts.length} accounts.`
  )
  for (const Klass of enabledNotificationClasses) {
    const klassConfig = getClassConfig(Klass, config)
    const notification = new Klass({
      ...klassConfig,
      cozyClient,
      t,
      data: { accounts, transactions }
    })
    try {
      await notification.sendNotification()
    } catch (err) {
      log('warn', JSON.stringify(err))
    }
  }
}
