import { BIGDECIMAL_ZERO, BIGINT_ZERO } from './constants';
import { StakingPool } from '../../generated/schema';
import { BigDecimal, log } from '@graphprotocol/graph-ts';

export function loadOrCreateStakingPool(poolId: string): StakingPool {
  let pool = StakingPool.load(poolId);
  if (pool == null) {
    pool = new StakingPool(poolId);
    pool.sAmount = BIGINT_ZERO;
    pool.amountStaked = BIGINT_ZERO;
    pool.ratio = BIGDECIMAL_ZERO;
    pool.currentAmount = BIGINT_ZERO;
    pool.totalDepositAmount = BIGINT_ZERO;
    pool.totalRewards = BIGINT_ZERO;
    pool.totalWithdrawAmount = BIGINT_ZERO;
    pool.save();
  }
  return pool as StakingPool;
}

export function updatePoolRatio(pool: StakingPool): void {
  if (!pool.sAmount.isZero()) {
    let currentAmountDecimal = new BigDecimal(pool.currentAmount);
    let sAmountDecimal = new BigDecimal(pool.sAmount);

    let ratio = currentAmountDecimal.div(sAmountDecimal);
    log.info('updatePoolRatio | Ratio: {}, currentAmount {}, sAmount {}', [
      ratio.toString(),
      pool.currentAmount.toString(),
      pool.sAmount.toString(),
    ]);
    pool.ratio = ratio;
  }
}
