class EventRouter
  def initialize
    @handlers = []
  end

  def register(handler)
    @handlers << handler
  end

  def dispatch(event)
    @handlers.each { |handler| handler.call(event) }
  end
end