# Official Content Sync Setup

## O que já funciona sem credencial

- A Home carrega com fallback editorial.
- O bloco do YouTube continua abrindo o canal oficial.
- O bloco do Google Meu Negócio continua abrindo o perfil e o Maps oficial.
- Se o sync falhar, a interface não quebra.
- O servidor Next usa as variaveis do ambiente ao subir com `npm run dev` ou `npm start`.

## O que precisa para sincronização real

### YouTube

Configure:

```env
YOUTUBE_API_KEY="sua_chave_da_google_cloud"
YOUTUBE_CHANNEL_HANDLE="@tag08.com.br_sobre"
# ou
YOUTUBE_CHANNEL_ID="UCxxxxxxxxxxxxxxxx"
```

### Google Business Profile

Configure um destes caminhos:

```env
GOOGLE_BUSINESS_LOCATION_NAME="accounts/123456789/locations/987654321"
GOOGLE_BUSINESS_ACCESS_TOKEN="token_oauth_temporario"
```

ou:

```env
GOOGLE_BUSINESS_LOCATION_NAME="accounts/123456789/locations/987654321"
GOOGLE_BUSINESS_REFRESH_TOKEN="refresh_token"
GOOGLE_BUSINESS_CLIENT_ID="client_id"
GOOGLE_BUSINESS_CLIENT_SECRET="client_secret"
```

## Onde o site consome isso

- Endpoint: `GET /api/official-content`
- Fallback editorial: `src/lib/officialContent.ts`
- Renderizacao da Home: `src/features/site/pages/Home.tsx`

## Regra prática

- Se a variável estiver vazia, usa fallback.
- Se a credencial estiver válida, a seção vira live automaticamente.
- Se um canal falhar e o outro funcionar, a página continua em modo parcial.

## Sequência recomendada

1. Copie `.env.example` para `.env`.
2. Preencha primeiro `YOUTUBE_API_KEY`.
3. Depois preencha `GOOGLE_BUSINESS_LOCATION_NAME` e o fluxo OAuth.
4. Rode `npm run build`.
5. Para desenvolvimento local com API real, use apenas `npm run dev`.
