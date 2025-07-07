# Cookbook:: devconnector
# Recipe:: install_nodejs_git

# Install Node.js
package 'nodejs' do
  action :install
end

# Install npm (if not included with nodejs)
package 'npm' do
  action :install
end

# Install Git
package 'git' do
  action :install
end
