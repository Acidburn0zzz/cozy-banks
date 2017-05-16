import styles from '../styles/operationsBoard'

import React from 'react'
import classNames from 'classnames'
import { translate } from '../lib/I18n'

import Figure from '../components/Figure'

export const Operation = ({ t, f, operation }) => (
  <tr className={styles['coz-table-row']}>
    <td className={classNames(styles['coz-table-cell'], styles['bnk-table-date'])}>
      {f(operation.date, 'DD MMMM YYYY')}
    </td>
    <td className={classNames(
        styles['coz-table-cell'],
        styles['bnk-table-desc'],
        styles[`bnk-table-desc--${operation.category}`])}
    >
      {operation.label}
    </td>
    <td className={classNames(styles['coz-table-cell'], styles['bnk-table-amount'])}>
      <Figure
        total={operation.amount}
        currency={operation.currency}
        signed
        coloredPositive
      />
    </td>
    <td className={classNames(styles['coz-table-cell'], styles['bnk-table-actions'], 'coz-desktop')}>
      {!operation.action && '－'}
      {operation.action &&
        <a
          href={operation.action.url}
          className={styles['bnk-table-actions-link']}
        >
          {t(`Movements.actions.${operation.action.type}`)}
        </a>
      }
    </td>
  </tr>
)

export default translate()(Operation)
