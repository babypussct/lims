import type { IncomingHttpHeaders } from 'node:http';

/**
 * The API routes only need Vercel's request/response contract at type level.
 * Keeping this small local contract avoids shipping the Vercel builder SDK as
 * an application dependency while preserving the runtime adapter's surface.
 */
export type VercelQuery = Record<string, string | string[] | undefined>;

export interface VercelRequest {
  method?: string;
  url?: string;
  headers: IncomingHttpHeaders;
  query: VercelQuery;
  body?: any;
}

export type VercelHeaderValue = string | string[] | number;

export interface VercelResponse {
  status(code: number): this;
  json(body: any): this;
  send(body: any): this;
  end(chunk?: any): this;
  redirect(url: string): this;
  redirect(status: number, url: string): this;
  setHeader(name: string, value: VercelHeaderValue): this;
  getHeader(name: string): VercelHeaderValue | undefined;
}
