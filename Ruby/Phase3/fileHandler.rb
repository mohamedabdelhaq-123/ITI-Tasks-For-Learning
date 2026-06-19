require_relative 'handler'

class FileHandler < Handler
  def initialize(filepath = 'events.log') # default value for the filepath
    @filepath = filepath
  end

  def call(event)
    File.open(@filepath, 'a') { |f| f.puts(event.to_s) } #append
  end
end