import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
export let BIGINT_ZERO = BigInt.fromI32(0);
export let BIGINT_ONE = BigInt.fromI32(1);
export let BIGDECIMAL_ZERO = new BigDecimal(BIGINT_ZERO);
export let ZERO_ADDRESS = Address.fromString(
  '0x0000000000000000000000000000000000000000'
);
export let LOCK_DURATION = BigInt.fromI32(60 * 60 * 24 * 2);
export let SECONDS_PER_DAY = 86400;
