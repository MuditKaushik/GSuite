export interface IGoogleConfig {
    client_id: string;
    client_email: string;
    private_key: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    auth_provider_x509_cert_url: string;
    client_secret: string;
    scope: string[];
    redirect_uris: string[];
}