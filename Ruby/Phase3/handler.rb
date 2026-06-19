class Handler
  def call(event)
    raise NotImplementedError, "#{self.class} must implement #call"
  end
end

# since ruby has no interface so we use this method to say that this class must implement this method