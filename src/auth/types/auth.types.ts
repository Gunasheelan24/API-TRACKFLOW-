export interface CreateAccountResponse {
  id: string;
  fullName: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RefreshRequest extends Request {
  cookies: {
    refreshToken?: string;
  };
}

export interface JwtRefreshTokenType {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
