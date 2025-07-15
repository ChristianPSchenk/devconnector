# Cookbook:: devconnector
# Recipe:: install_nodejs_git

# Install Node.js
package 'nodejs' do
  action :install
  options '-o DPkg::Lock::Timeout=300'
end

# Install npm (if not included with nodejs)
package 'npm' do
  action :install
  options '-o DPkg::Lock::Timeout=300'  
end

# Install Git
package 'git' do
  action :install
  options '-o DPkg::Lock::Timeout=300'  
end

directory '/opt/devconnector' do
  owner 'root'
  group 'root'
  mode '0777'
  action :create
  recursive true
end


git "/opt/devconnector/repo" do
  repository "https://github.com/ChristianPSchenk/devconnector.git"
  revision "main"
  action :sync
end


file '/opt/devconnector/repo/config/production.json' do
  content <<-EOF
{
    "mongoURI": "will be set via environment in build_and_run.sh",
    "jwtSecret": "will be set via environment in build_and_run.sh",
    "jwtExpiry": "3600",
    "githubClientId": "...",
    "githubSecret": "..."
}
  EOF
  owner 'root'
  group 'root'
  mode '0644'
  action :create
end

file '/etc/systemd/system/devconnector.service' do
  content <<-EOF
[Unit]
Description=DevConnector Node.js App
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/devconnector/repo
Environment=NODE_ENV=production
Environment=PORT=80
ExecStart=/bin/bash /opt/devconnector/repo/build_and_run.sh
Restart=always

[Install]
WantedBy=multi-user.target
  EOF
  owner 'root'
  group 'root'
  mode '0644'
  action :create
end

execute 'reload_systemd' do
  command 'systemctl daemon-reload'
end

service 'devconnector' do
  action [:enable, :start]
end



