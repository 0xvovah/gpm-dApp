import { CHAIN_ID } from "@/lib/constants/network";

export const BACKEND_HTTP_SERVER_URL =
  process.env.NEXT_PUBLIC_BACKEND_HTTP_SERVER_URL;
export const BACKEND_WS_SERVER_URL =
  process.env.NEXT_PUBLIC_BACKEND_WS_SERVER_URL;
export const PONDER_HTTP_SERVER_URL =
  process.env.NEXT_PUBLIC_PONDER_HTTP_SERVER_URL;

export const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID;

export const AUTH_BACKEND_ROOT = BACKEND_HTTP_SERVER_URL + "/auth";
export const TOKEN_BACKEND_ROOT = BACKEND_HTTP_SERVER_URL + "/tokens";
export const COMMENT_BACKEND_ROOT = BACKEND_HTTP_SERVER_URL + "/comment";
export const PROFILE_BACKEND_ROOT = BACKEND_HTTP_SERVER_URL + "/profile";

// GET: get auth token
export const AUTH_BACKEND_GET_AUTH_TOKEN = AUTH_BACKEND_ROOT + "/auth-token";

// POST: sign message
export const AUTH_BACKEND_POST_SIGN_MESSAGE =
  AUTH_BACKEND_ROOT + "/sign-message";

// POST: upload token logo
export const TOKEN_BACKEND_POST_UPLOAD_IMAGE = TOKEN_BACKEND_ROOT + "/logo";
// GET: last token info
export const TOKEN_BACKEND_GET_LAST = TOKEN_BACKEND_ROOT + "/last";
// GET: a list of last tokens
export const TOKEN_BACKEND_GET_LASTS = TOKEN_BACKEND_ROOT + "/lasts";
// GET: a list of last tokens
export const TOKEN_BACKEND_GET_TRENDINGS = TOKEN_BACKEND_ROOT + "/trending";
// GET: current king token info
export const TOKEN_BACKEND_GET_KING = TOKEN_BACKEND_ROOT + "/king";

// GET: get profile general info
export const PROFILE_BACKEND_GET_INFO = PROFILE_BACKEND_ROOT + "/profile";
// GET: get profile portfolio info
export const PROFILE_PORTFORLIO_BACKEND_GET_INFO =
  PROFILE_BACKEND_ROOT + "/portfolio";

// POST: upload comemnt attachment
export const COMMENT_BACKEND_POST_CREATE = COMMENT_BACKEND_ROOT;
// GET: a list of comments
export const COMMENT_BACKEND_GET = COMMENT_BACKEND_ROOT;

// WebSocket events
export const SOCKET_NEWS_ROOM = `news:${CHAIN_ID}`;
export const SOCKET_NEWS_ROOM_TOKEN_CREATED = `${SOCKET_NEWS_ROOM}:newToken`;
export const SOCKET_NEWS_ROOM_TOKEN_TRADED = `${SOCKET_NEWS_ROOM}:newTrade`;
export const SOCKET_TRADE_ROOM = `trade:${CHAIN_ID}`;
export const SOCKET_COMMENT_ROOM = `comment:${CHAIN_ID}`;
