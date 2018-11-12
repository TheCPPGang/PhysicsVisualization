module.exports = {
  apps: [{
    name: "PhysicsVisualization",
    script: "./index.js"
  }],
  deploy: {
    production: {
      user: "ec2-user",
      host: "ec2-18-216-89-167.us-east-2.compute.amazonaws.com",
      key: "D:/Users/Gippy/Downloads/physics2/test/seephysics.pem",
      ref: "origin/master",
      repo: "git@github.com:TheCPPGang/PhysicsVisualization.git",
      path: "/home/ec2-user/server",
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js"
    }
  }
}