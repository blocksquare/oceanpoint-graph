import { BIGINT_ZERO } from './constants';
import { StakingPoolUser } from '../../generated/schema';

export function loadOrCreateStakingPoolUser(
  poolId: string,
  userId: string
): StakingPoolUser {
  let poolUserId = poolId + '-' + userId;
  let poolUser = StakingPoolUser.load(poolUserId);
  if (poolUser == null) {
    poolUser = new StakingPoolUser(poolUserId);
    poolUser.user = userId;
    poolUser.pool = poolId;
    poolUser.sAmount = BIGINT_ZERO;
    poolUser.lockedUntil = BIGINT_ZERO;
    poolUser.save();
  }
  return poolUser as StakingPoolUser;
}
