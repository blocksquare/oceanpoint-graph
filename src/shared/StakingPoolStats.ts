import { BigInt } from '@graphprotocol/graph-ts';
import { SECONDS_PER_DAY } from './constants';
import { StakingPool, StakingPoolStats } from '../../generated/schema';

export function updatePoolStats(pool: StakingPool, timestamp: BigInt): void {
  let i32Timestamp = timestamp.toI32();
  let dayId = i32Timestamp / SECONDS_PER_DAY;
  let poolStatsId = pool.id + '-' + dayId.toString();
  // No need to load the StakingPoolStats here.
  // It will automatically create or override the old values this way.
  let poolStats = new StakingPoolStats(poolStatsId);
  poolStats.pool = pool.id;
  poolStats.date = dayId * SECONDS_PER_DAY;
  poolStats.sAmount = pool.sAmount;
  poolStats.amountStaked = pool.amountStaked;
  poolStats.ratio = pool.ratio;
  poolStats.currentAmount = pool.currentAmount;
  poolStats.totalDepositAmount = pool.totalDepositAmount;
  poolStats.totalRewards = pool.totalRewards;
  poolStats.totalWithdrawAmount = pool.totalWithdrawAmount;

  poolStats.save();
}
