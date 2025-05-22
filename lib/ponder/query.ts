import { gql } from "@apollo/client";

// get a list of token holders
const holdersQuery = gql`
  query holders($tokenAddress: String!, $chainId: BigInt!) {
    holders(
      limit: 10
      orderBy: "amount"
      orderDirection: "desc"
      where: { token: $tokenAddress, amount_gt: "0", chainId: $chainId }
    ) {
      items {
        account
        amount
        chainId
        token
      }
    }
  }
`;

// get a list of token candles on gopampme
const candlesQuery = gql`
  query candles(
    $tokenAddress: String!
    $chainId: BigInt!
    $from: BigInt!
    $to: BigInt!
  ) {
    candles(
      limit: 100
      orderBy: "timestamp"
      orderDirection: "desc"
      where: {
        token: $tokenAddress
        chainId: $chainId
        timestamp_gte: $from
        timestamp_lte: $to
      }
    ) {
      items {
        id
        chainId
        close
        high
        low
        open
        timestamp
        volume
        token
      }
    }
  }
`;

// get a list of token candles on dex
const dexCandlesQuery = gql`
  query dexCandle(
    $tokenAddress: String!
    $chainId: BigInt!
    $dexPair: String!
    $from: BigInt!
    $to: BigInt!
  ) {
    dexCandles(
      limit: 100
      orderBy: "timestamp"
      orderDirection: "desc"
      where: {
        token: $tokenAddress
        chainId: $chainId
        dexPair: $dexPair
        timestamp_gte: $from
        timestamp_lte: $to
      }
    ) {
      items {
        id
        chainId
        close
        high
        low
        open
        timestamp
        volume
        token
        dexPair
      }
    }
  }
`;

export { holdersQuery, candlesQuery, dexCandlesQuery };
