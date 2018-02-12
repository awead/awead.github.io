#!/Users/awead/.rubies/ruby-2.1.2/bin/ruby
require 'webrick'

root = File.expand_path './'
server = WEBrick::HTTPServer.new :Port => 8000, :DocumentRoot => root
`open http://localhost:8000`
trap 'INT' do server.shutdown end
server.start
