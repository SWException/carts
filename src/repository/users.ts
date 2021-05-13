export interface Users {
    getUsername(token: string): Promise<string>;
}