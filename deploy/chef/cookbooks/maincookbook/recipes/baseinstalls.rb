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

directory '/opt/devconnector' do
  owner 'root'
  group 'root'
  mode '0777'
  action :create
  recursive true
end


git "/opt/devconnector/repo" do
  repository "https://github.com/ChristianPSchenk/devconnector.git"
  revision "/refs/heads/main""
  action :sync
end

execute 'run_setup_script' do
  command 'bash /opt/devconnector/repo/build_and_run.sh'
  cwd '/opt/devconnector/repo'
  action :run
end