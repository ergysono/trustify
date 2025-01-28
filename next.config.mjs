/** @type {import('next').NextConfig} */
import crypto from 'crypto';

const generateNonce = () => Buffer.from( crypto.randomUUID() ).toString( 'base64' );

const nextConfig = {
  async headers() {
    const nonce = generateNonce();
    return [
      {
        source: "/(.*)", // Applica la CSP a tutte le pagine
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: `
              default-src 'self';
              child-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org;
              frame-src https://auth.privy.io https://verify.walletconnect.com https://verify.walletconnect.org https://challenges.cloudflare.com;
              connect-src 'self' https://auth.privy.io wss://relay.walletconnect.com wss://relay.walletconnect.org wss://www.walletlink.org https://*.rpc.privy.systems https://api.mainnet-beta.solana.com https://api.devnet.solana.com https://api.testnet.solana.com https://api.relay.link https://api.testnets.relay.link;
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://telegram.org;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data:;
              font-src 'self';
            `.replace( /\n/g, "" ), // Rimuove le nuove righe
          },
        ],
      },
    ];
  },
};

export default nextConfig;
