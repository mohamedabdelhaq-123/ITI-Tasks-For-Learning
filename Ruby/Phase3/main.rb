require_relative 'event'
require_relative 'eventRouter'
require_relative 'consoleHandler'
require_relative 'fileHandler'
require_relative 'statsHandler'

router = EventRouter.new
stats_handler = StatsHandler.new

router.register(ConsoleHandler.new)
router.register(FileHandler.new)
router.register(stats_handler)

while true
  puts
  puts "----------- LifeTrack -----------"
  puts "1. Log a work session"
  puts "2. Log a study session"
  puts "3. Log an exercise session"
  puts "4. Log a meal"
  puts "5. Exit"
  print "\nChoose an option: "
  choice = gets.chomp

  break if choice == '5'

  type = case choice
         when '1' then 'work'
         when '2' then 'study'
         when '3' then 'exercise'
         when '4' then 'meal'
         else nil
         end

  if type.nil?
    puts "Invalid choice."
    next
  end

  print "Description: "
  description = gets
  print "Duration (minutes): "
  duration = gets.to_i

  event = Event.new(type: type, description: description, duration: duration)
  router.dispatch(event)
  puts "✓ Event logged."
end

stats_handler.print_summary
puts "Goodbye!"