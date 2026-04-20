import { Decimal } from 'decimal.js'
import type { ValueTransformer } from 'typeorm'

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_EVEN })

export { Decimal }

export const decimalTransformer: ValueTransformer = {
  to(value: Decimal | null): string | null {
    return value === null || value === undefined ? null : value.toFixed(2)
  },
  from(value: string | null): Decimal | null {
    return value === null || value === undefined ? null : new Decimal(value)
  },
}
