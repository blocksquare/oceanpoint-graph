import { Token } from "../../generated/schema";
import { BIGINT_ZERO } from "./constants";

export function createToken(tokenId: string): Token {
  let token = new Token(tokenId);
  token.name = "";
  token.symbol = "";
  token.totalSupply = BIGINT_ZERO;
  token.totalHolders = BIGINT_ZERO;
  token.totalTransfers = BIGINT_ZERO;
  token.save();
  return token;
}

export function loadOrCreateToken(tokenId: string): Token {
  let token = Token.load(tokenId);
  if (token == null) {
    token = createToken(tokenId);
  }
  return token as Token;
}
