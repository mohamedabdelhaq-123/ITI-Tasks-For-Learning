require_relative 'handler' # handler -> abstract class

class ConsoleHandler < Handler 
  def call(event)
    puts event.to_s
  end
end