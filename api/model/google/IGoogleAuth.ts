export interface IGoogleAuth {
    access_token: string;
    token_type: string;
    client_id: string;
    expires_at: string;
    expires_in: string;
    issued_at: string;
    status: {
        google_logged_in: boolean,
        signed_in: boolean,
        method: string
    },
    error: string
}