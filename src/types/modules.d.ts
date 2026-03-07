declare module "next/server" {
  export class NextRequest extends Request {
    constructor(input: RequestInfo | URL, init?: RequestInit);
    readonly nextUrl?: URL;
    readonly cookies?: ReadonlyMap<string, string>;
    readonly headers: Headers;
    json(): Promise<unknown>;
  }
  export class NextResponse extends Response {}
}

declare module "bcryptjs" {
  export function hash(s: string, rounds: number): Promise<string>;
  export function compare(s: string, hash: string): Promise<boolean>;
}
