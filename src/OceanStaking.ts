import {
  Approval,
  Deposit,
  Reward,
  Transfer,
  Withdraw,
} from '../generated/OceanStaking/OceanStaking';

import { loadOrCreateStakingPool, updatePoolRatio } from './shared/StakingPool';
import { loadOrCreateStakingPoolUser } from './shared/StakingPoolUser';
import { LOCK_DURATION } from './shared/constants';
import { updatePoolStats } from './shared/StakingPoolStats';
import { Address, BigInt } from '@graphprotocol/graph-ts';
import { StakingPool } from '../generated/schema';

export function handleApproval(event: Approval): void {}

export function handleDeposit(event: Deposit): void {
  let poolId = event.address.toHex();
  let amountIn = event.params.in_amount;
  let amountOut = event.params.out_amount;

  let pool = loadOrCreateStakingPool(poolId);
  pool.currentAmount = pool.currentAmount.plus(amountIn);
  pool.sAmount = pool.sAmount.plus(amountOut);
  pool.amountStaked = pool.amountStaked.plus(amountIn);
  pool.totalDepositAmount = pool.totalDepositAmount.plus(amountIn);

  updatePoolRatio(pool);
  pool.save();

  updatePoolStats(pool, event.block.timestamp);

  let userId = event.params.owner.toHex();
  let poolUser = loadOrCreateStakingPoolUser(poolId, userId);
  poolUser.sAmount = poolUser.sAmount.plus(amountOut);
  poolUser.lockedUntil = event.block.timestamp.plus(LOCK_DURATION);
  poolUser.save();
}

export function handleReward(event: Reward): void {
  let poolId = event.address.toHex();
  let pool = loadOrCreateStakingPool(poolId);
  pool.currentAmount = pool.currentAmount.plus(event.params.amount);
  pool.totalRewards = pool.totalRewards.plus(event.params.amount);
  updatePoolRatio(pool);

  pool.save();
  updatePoolStats(pool, event.block.timestamp);
}

export function handleTransfer(event: Transfer): void {}

export function handleWithdraw(event: Withdraw): void {
  let poolId = event.address.toHex();
  let amountIn = event.params.in_amount;
  let amountOut = event.params.out_amount;

  let pool = StakingPool.load(poolId)!;
  pool.currentAmount = pool.currentAmount.minus(amountOut);
  pool.sAmount = pool.sAmount.minus(amountIn);
  pool.amountStaked = pool.amountStaked.minus(amountOut);
  pool.totalWithdrawAmount = pool.totalWithdrawAmount.plus(amountOut);
  updatePoolRatio(pool);

  pool.save();

  updatePoolStats(pool, event.block.timestamp);

  let userId = event.params.owner.toHex();
  let poolUser = loadOrCreateStakingPoolUser(poolId, userId);
  poolUser.sAmount = poolUser.sAmount.minus(amountIn);
  poolUser.save();
}
