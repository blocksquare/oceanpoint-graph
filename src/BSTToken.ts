import { store } from '@graphprotocol/graph-ts';
import { Transfer } from '../generated/BSTToken/BSTToken';
import { TokenHolder, User } from '../generated/schema';
import { BIGINT_ONE, BIGINT_ZERO, ZERO_ADDRESS } from './shared/constants';

import { loadOrCreateToken } from './shared/Token';
import { createTokenHolder } from './shared/TokenHolder';

export function handleTransfer(event: Transfer): void {
  let tokenId = event.address.toHex();
  let token = loadOrCreateToken(tokenId);

  let from = event.params._from;
  let to = event.params._to;
  let value = event.params._amount;

  if (value > BIGINT_ZERO) {
    if (from == ZERO_ADDRESS) {
      token.totalSupply = token.totalSupply.plus(value);
    } else {
      let fromUserId = from.toHex();
      let fromTokenHolderId = tokenId + '-' + fromUserId;
      let fromTokenHolder = TokenHolder.load(fromTokenHolderId);
      if (fromTokenHolder == null) {
        fromTokenHolder = createTokenHolder(
          fromTokenHolderId,
          tokenId,
          fromUserId
        );
      }
      let newTotalWithdrawAmount = fromTokenHolder.amount.minus(value);
      if (newTotalWithdrawAmount.isZero()) {
        token.totalHolders = token.totalHolders.minus(BIGINT_ONE);
        store.remove('TokenHolder', fromTokenHolderId);
      } else {
        fromTokenHolder.amount = newTotalWithdrawAmount;
        fromTokenHolder.save();
      }
    }

    if (to == ZERO_ADDRESS) {
      token.totalSupply = token.totalSupply.minus(value);
    } else {
      let toUserId = to.toHex();
      // We only create the user here. When the user receive the token for the first time.
      let user = User.load(toUserId);
      if (!user) {
        user = new User(toUserId);
        user.save();
      }

      let toTokenHolderId = tokenId + '-' + toUserId;
      let toTokenHolder = TokenHolder.load(toTokenHolderId);
      if (toTokenHolder == null) {
        toTokenHolder = createTokenHolder(toTokenHolderId, tokenId, toUserId);
        token.totalHolders = token.totalHolders.plus(BIGINT_ONE);
      }
      let netotalWithdrawAmount = toTokenHolder.amount.plus(value);
      toTokenHolder.amount = netotalWithdrawAmount;
      toTokenHolder.save();
    }
  }

  token.totalTransfers = token.totalTransfers.plus(BIGINT_ONE);
  token.save();
}
