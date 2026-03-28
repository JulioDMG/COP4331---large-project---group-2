module.exports = {
  apps: [{
    name: "arcade-api",
    script: "/root/arcade-backend/server.js",
    cwd: "/root/arcade-backend",
    interpreter: "/usr/bin/node",
    
    // ? Correct key names for environments:
    env: {  // Default fallback
      NODE_ENV: "development",
      PORT: 5000
    },
    env_development: {  // ? This fixes the warning
      NODE_ENV: "development", 
      PORT: 5000
    },
    env_production: {
      NODE_ENV: "production",
      PORT: 5000
    },
    
    // Logging
    error_file: "/root/arcade-backend/logs/err.log",
    out_file: "/root/arcade-backend/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss",
    merge_logs: true,
    
    // Stability
    max_restarts: 3,
    restart_delay: 3000,
    min_uptime: "10s",
    
    // Disable watch in production
    watch: false,
    ignore_watch: ["node_modules", "logs", ".git"]
  }]
}
