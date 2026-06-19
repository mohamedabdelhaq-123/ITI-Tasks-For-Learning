require_relative 'handler'

class StatsHandler < Handler
  def initialize
    @counts = Hash.new(0)
    @total_minutes = 0
  end

  def call(event)
    @counts[event.type] += 1
    @total_minutes += event.duration
  end

  def print_summary
    puts
    puts "----------- Session Summary ----------"
    @counts.each { |type, count| puts "#{type.capitalize}: #{count} logged" }
    puts "Total time: #{@total_minutes} minutes"
  end
end