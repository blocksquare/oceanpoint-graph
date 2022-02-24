import { TokenHolder } from "../../generated/schema";
import { BIGINT_ZERO } from "./constants";

export function createTokenHolder(
  tokenHolderId: string,
  tokenId: string,
  userId: string
): TokenHolder {
  let tokenHolder = new TokenHolder(tokenHolderId);
  tokenHolder.amount = BIGINT_ZERO;
  tokenHolder.user = userId;
  tokenHolder.token = tokenId;
  tokenHolder.save();
  return tokenHolder;
}
