

log 'message' do
  message 'Writing hellochef.txt'
  level :info
end


file 'hellochef.txt' do
  content 'Welcome to Chef'
end