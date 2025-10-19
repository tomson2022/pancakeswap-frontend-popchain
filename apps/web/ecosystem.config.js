module.exports = {
  apps: [{
    name: 'popchainswap',
    script: 'npx',
    args: 'next start -p 3000',
    cwd: '/var/www/popchainswap',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '2G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_CHAIN_ID: 7257,
      NEXT_PUBLIC_USE_CUSTOM_LOGO: 'true'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      NEXT_PUBLIC_CHAIN_ID: 7257,
      NEXT_PUBLIC_USE_CUSTOM_LOGO: 'true'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: '/var/log/popchainswap/error.log',
    out_file: '/var/log/popchainswap/out.log',
    log_file: '/var/log/popchainswap/combined.log',
    time: true
  }]
}
