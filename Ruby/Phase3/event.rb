class Event
  attr_reader :type, :description, :duration, :timestamp

  def initialize(type:, description:, duration:)
    @type = type
    @description = description
    @duration = duration
    @timestamp = Time.now
  end

  def to_s
    "[#{timestamp.strftime('%Y-%m-%d %H:%M')}] #{type.upcase} — #{description} (#{duration} min)"
  end
end

# carrier of data