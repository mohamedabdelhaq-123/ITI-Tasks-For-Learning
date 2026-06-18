# Ruby Fundamentals
### A Learning & Revision Guide for Ruby on Rails Developers

---

## Table of Contents

1. [Ruby Mindset](#1-ruby-mindset)
2. [Why Ruby Exists](#2-why-ruby-exists)
3. [Ruby and Rails Relationship](#3-ruby-and-rails-relationship)
4. [Installation & Running Ruby](#4-installation--running-ruby)
5. [Basic Syntax](#5-basic-syntax)
6. [Numbers and Strings](#6-numbers-and-strings)
7. [Symbols](#7-symbols)
8. [Ranges](#8-ranges)
9. [Type Conversion vs Kernel Methods](#9-type-conversion-vs-kernel-methods)
10. [Variables](#10-variables)
11. [Methods](#11-methods)
12. [Flow Control](#12-flow-control)
13. [Loops and Iterators](#13-loops-and-iterators)
14. [Arrays](#14-arrays)
15. [Hashes](#15-hashes)
16. [Blocks](#16-blocks)
17. [Exception Handling](#17-exception-handling)
18. [Classes and Objects](#18-classes-and-objects)
19. [Getters and Setters](#19-getters-and-setters)
20. [Inheritance](#20-inheritance)
21. [Access Control](#21-access-control)
22. [Class Variables and Class Methods](#22-class-variables-and-class-methods)
23. [Modules](#23-modules)
24. [Mixins](#24-mixins)
25. [Ruby Conventions](#25-ruby-conventions)
26. [Common Beginner Pitfalls](#26-common-beginner-pitfalls)
27. [Rails-Relevant Ruby Concepts](#27-rails-relevant-ruby-concepts)
28. [Ruby Cheat Sheet](#28-ruby-cheat-sheet)

---

## Learning Flow

```
Ruby Mindset
    ↓
Installation & Basics
    ↓
Types: Numbers, Strings, Symbols, Ranges
    ↓
Variables
    ↓
Methods & Flow Control
    ↓
Loops & Iterators
    ↓
Collections: Arrays & Hashes
    ↓
Blocks  ←  Ruby's superpower
    ↓
Exception Handling
    ↓
OOP: Classes, Inheritance, Access Control
    ↓
Modules & Mixins
    ↓
Rails-Oriented Mental Models
```

---

## 1. Ruby Mindset

Ruby is built around one philosophy: **programmer happiness**.

- Code should read like English.
- Less boilerplate, more expressiveness.
- **Everything is an object** — including integers, `nil`, `true`, and `false`.
- Multiple ways to do the same thing — Ruby embraces flexibility.

```ruby
1.class       # Integer
nil.class     # NilClass
true.class    # TrueClass
"hi".class    # String
```

> Coming from TypeScript/JS: primitives like `1` and `true` are **not** objects there. In Ruby, they are — you can call methods on them directly.

---

## 2. Why Ruby Exists

| Fact | Detail |
|------|--------|
| Creator | Yukihiro Matsumoto ("Matz"), Japan |
| Year | 1995 |
| Philosophy | Optimize for developer happiness, not machine speed |
| Design | Pure OOP — everything is an object |
| Influences | Smalltalk, Lisp, Perl, Python |
| Runtime | Interpreted (like Python, not compiled like C++) |

**Matz's goal:** "Ruby is designed to make programmers happy."

---

## 3. Ruby and Rails Relationship

```
Ruby  (the language)
  │
  └── Ruby on Rails  (a framework built ON Ruby)
          │
          ├── ActiveRecord     ← OOP + Modules + Blocks
          ├── ActionController ← Classes + Inheritance
          ├── ActionView       ← ERB templates + helpers
          └── Routing          ← Blocks + Symbols
```

- Rails is not a separate language — it is deeply Ruby.
- Rails "magic" = Ruby features used cleverly (blocks, modules, meta-programming).
- The better you know Ruby, the more **predictable** Rails becomes.
- You will recognize nearly every Rails pattern once you know the Ruby building blocks.

---

## 4. Installation & Running Ruby

### Version Manager — asdf

Use **asdf** to manage Ruby versions — equivalent to `nvm` for Node.
It handles multiple languages (Ruby, Node, Python…) with one tool, making it the better long-term choice.

**Step 1 — Install asdf itself**

```bash
# macOS (Homebrew)
brew install asdf

# Ubuntu / Debian
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0

# Then add to your shell (~/.bashrc or ~/.zshrc):
echo '. "$HOME/.asdf/asdf.sh"' >> ~/.bashrc
source ~/.bashrc
```

**Step 2 — Add the Ruby plugin**

```bash
asdf plugin add ruby                  # register the Ruby plugin
asdf plugin list                      # confirm it's listed
asdf plugin update ruby               # keep the plugin up to date
```

**Step 3 — Install Ruby**

```bash
asdf install ruby latest              # install the latest stable Ruby
asdf install ruby 3.3.0               # or install a specific version
asdf list ruby                        # see all installed versions
```

**Step 4 — Set the version to use**

```bash
asdf global ruby 4.0.5               # use this version everywhere (writes to ~/.tool-versions)
asdf local ruby 4.0.5                # use this version in the current folder only (writes .tool-versions here)
```

> Always use the **actual version number** (e.g. `4.0.5`), not the word `latest` — asdf doesn't resolve aliases in these commands.

> `.tool-versions` is asdf's equivalent of `.nvmrc` — commit it to your project repo so teammates use the same Ruby version.

**Step 5 — Verify**

```bash
asdf current ruby                     # confirm the active version
ruby --version                        # e.g. ruby 4.0.5
gem --version                         # confirm gem is available
which ruby                            # should point to ~/.asdf/shims/ruby
```

**Common day-to-day asdf commands**

| Command | What it does |
|---------|-------------|
| `asdf plugin add ruby` | Register Ruby support |
| `asdf plugin update ruby` | Update the Ruby plugin |
| `asdf install ruby latest` | Install latest Ruby |
| `asdf install ruby 4.0.5` | Install a specific version |
| `asdf list ruby` | List installed Ruby versions |
| `asdf list all ruby` | List ALL available Ruby versions |
| `asdf global ruby 4.0.5` | Set global Ruby version (use actual version number) |
| `asdf local ruby 4.0.5` | Set local version (writes `.tool-versions` in current dir) |
| `asdf current` | Show active versions for all plugins |
| `asdf current ruby` | Show active Ruby version |
| `asdf uninstall ruby 4.0.5` | Remove an installed version |
| `asdf reshim ruby` | Rebuild shims after installing gems |

### Running a Ruby File

```bash
ruby filename.rb
```

### Interactive Shell: pry

`pry` is a better REPL than the built-in `irb` — faster, colorized, feature-rich.

```bash
gem install pry     # install once
pry                 # launch
```

Useful `pry` commands:

| Command | Purpose |
|---------|---------|
| `ls SomeClass` | List all methods |
| `cd object` | Step inside an object |
| `show-method name` | Show method source code |
| `? method_name` | Quick inline docs |
| `exit` | Exit pry |

### Getting Documentation

```bash
ri String          # docs for the String class
ri String#upcase   # docs for a specific method
ri Array#reject    # look up any method
```

---

## 5. Basic Syntax

### Comments

```ruby
# Single line comment

=begin
  Multi-line comment.
  Rarely used in practice — just stack # lines instead.
=end
```

### Output Methods

| Method | Behavior |
|--------|----------|
| `puts` | Adds newline. Calls `.to_s` on the value. |
| `print` | No newline. |
| `p` | Shows raw representation (`.inspect`). Great for debugging. |

```ruby
puts "hello"    # hello
print "hello"   # hello (no newline)
p "hello"       # "hello"   ← with quotes, useful for debugging
p nil           # nil
p [1, 2, 3]    # [1, 2, 3]
```

### Number Literals

```ruby
1_000_000    # valid! Same as 1000000 — underscores just improve readability
3.14         # Float
```

### Syntactic Sugar

```ruby
1 + 1        # is actually:
1.+(1)       # a method call on Integer!
```

💡 **Connection:** Operators in Ruby are just methods. This is why Rails can override them so cleanly (e.g., `errors << "message"`).

---

## 6. Numbers and Strings

### String Creation

```ruby
name = "Ahmed"    # double quotes — supports interpolation
name = 'Ahmed'    # single quotes — no interpolation (preferred when no interpolation needed)
```

### String Interpolation (double quotes only)

```ruby
name = "Ahmed"
puts "Hello, #{name}"    # Hello, Ahmed
puts 'Hello, #{name}'    # Hello, #{name}  ← no interpolation in single quotes!
```

### String Concatenation

```ruby
'h' + 'w'        # "hw"
'h' + 3          # TypeError! Ruby won't auto-convert
'h' + 3.to_s     # "h3"
```

⚠ **Pitfall:** Ruby does **not** auto-coerce types. Coming from JS (`"h" + 3` → `"h3"`), this will catch you.

### String Indexing

```ruby
a = "hello"

a[2, 3]     # "llo"  — start at index 2, take 3 characters (start, length)
a[2..3]     # "ll"   — indices 2 through 3, inclusive
```

```
  h  e  l  l  o
  0  1  2  3  4

a[2, 3]  →  l  l  o   (index 2, length 3)
a[2..3]  →  l  l      (index 2 to 3)
```

### Useful String Methods

```ruby
a = "hello"
a.class           # String
a.methods         # lists every available method — useful in pry
a.upcase          # "HELLO"
a.downcase        # "hello"
a.capitalize      # "Hello"
a.reverse         # "olleh"
a.length          # 5
a.include?("e")   # true  ← boolean method, note the ?
a.gsub("l", "r")  # "herro"
a.split("")       # ["h", "e", "l", "l", "o"]
```

### Bang Methods (`!`)

```ruby
a = "hello"

a.capitalize      # returns "Hello" — a is still "hello"
a.capitalize!     # modifies a in place — a is now "Hello"
```

```
Without !                With !
─────────────────        ──────────────────
Returns a new value      Modifies original
Non-destructive          Destructive
Safe for the original    Changes the original
```

💡 **Rails Connection:** `save` vs `save!` in ActiveRecord follows this exact convention:
- `save` → returns `false` on failure
- `save!` → raises `ActiveRecord::RecordInvalid` on failure

---

## 7. Symbols

### What is a Symbol?

An **immutable, unique identifier**. Like a frozen string that always points to the same object in memory.

```ruby
:pending          # a symbol
:pending.class    # Symbol
```

### Symbol vs String

| | String | Symbol |
|---|--------|--------|
| Syntax | `"name"` | `:name` |
| Mutability | Mutable | Immutable |
| Memory | New object each time | Always same object |
| Best for | Text data | Keys, identifiers, options |

```ruby
"name".object_id == "name".object_id    # false  (two different objects in memory)
:name.object_id  == :name.object_id     # true   (always the exact same object)
```

### Why Use Symbols as Hash Keys?

- **Faster comparison** — compares a single integer (object ID), not character by character
- **Memory efficient** — one object, not many duplicates
- **Expressive intent** — signals "this is an identifier, not user-facing text"

💡 **Rails Connection:** Symbols are absolutely everywhere in Rails:
```ruby
params[:name]
render :json
validates :email, presence: true
belongs_to :user
scope :active, -> { where(active: true) }
```

---

## 8. Ranges

```ruby
a = (1..10)      # 10 IS included   (closed range)
a = (1...10)     # 10 is NOT included (exclusive range)

a.include?(5)    # true
a.include?(10)   # true for .., false for ...
a.to_a           # convert to array: [1, 2, 3, ...]
```

⚠ **Pitfall:** `..` vs `...` is easy to mix up. Remember: three dots *excludes* the end.

💡 **Rails Connection:** Ranges appear in validations:
```ruby
validates :age, numericality: { in: 18..65 }
```

---

## 9. Type Conversion vs Kernel Methods

Two approaches to converting types — they fail very differently.

### Type Conversion Methods (lenient)

Called on the object itself. Never raises. Returns a default on bad input.

```ruby
"abc".to_i       # 0       (default — no error)
"3.5".to_f       # 3.5
"42abc".to_i     # 42      (stops at first non-digit)
nil.to_s         # ""
nil.to_a         # []
nil.to_i         # 0
```

### Kernel Methods (strict)

Top-level methods. Raise immediately on bad input.

```ruby
Integer("42")    # 42
Integer("abc")   # ArgumentError!
Float("3.5")     # 3.5
Float("abc")     # ArgumentError!
```

### When to Use Which?

| Situation | Use |
|-----------|-----|
| User input — handle gracefully, provide a fallback | `.to_i`, `.to_f`, `.to_s` |
| Input that **must** be valid — fail fast | `Integer()`, `Float()` |

---

## 10. Variables

### Variable Types at a Glance

```
x        = "value"    →  local     (lowercase, snake_case)
$x       = "value"    →  global    ($ prefix — use very sparingly)
@x       = "value"    →  instance  (belongs to one object of a class)
@@x      = "value"    →  class     (shared across ALL instances)
MAX      = 100        →  constant  (SCREAMING_SNAKE_CASE — can reassign, but gives a warning)
MyClass               →  class/module name (PascalCase — starts with capital letter)
```

### Multiple Assignment

```ruby
x = y = 10          # both are 10

x, y = 5, 10        # x=5, y=10
x, y = y, x         # swap in one line — idiomatic Ruby!

x = 1, 2, 3         # x = [1, 2, 3]
x, = 1, 2, 3        # x = 1   (trailing comma grabs first only)
x, y = 1, 2, 3      # x=1, y=2  (3 is silently ignored)
```

💡 **Connection:** Multiple assignment is used in Rails for readable return values and destructuring.

---

## 11. Methods

### Basic Definition

```ruby
def say_hello(name)
  puts "hello, #{name}"
end

say_hello "Ahmed"       # parentheses optional for simple calls
say_hello("Ahmed")      # parentheses explicit — both work
```

### Implicit Return

Ruby methods **always return the last evaluated expression** — no `return` keyword needed.

```ruby
def add(a, b)
  a + b       # automatically returned
end

add(2, 3)     # 5
```

Use `return` only for **early exit**:

```ruby
def find(x)
  return nil if x.nil?
  # ... rest of logic
end
```

### Default Parameters

```ruby
def greet(name = "World")
  puts "Hello, #{name}"
end

greet           # Hello, World
greet("Ahmed")  # Hello, Ahmed
```

### Variadic Arguments

```ruby
def sum(*args)    # *args is always an array
  args.sum
end

sum(1, 2, 3)    # 6
sum(1, 2, 3, 4) # 10
```

Like `...args` in JavaScript, but Ruby uses `*`.

### Method Naming Conventions

| Suffix | Meaning | Examples |
|--------|---------|---------|
| `?` | Returns boolean | `include?`, `empty?`, `valid?` |
| `!` | Destructive or raises on failure | `save!`, `capitalize!`, `create!` |
| *(none)* | Normal method | `save`, `capitalize` |

### alias

```ruby
def say_hello
  puts "hello"
end

alias greet say_hello   # greet copies say_hello's implementation RIGHT NOW
```

Key behavior: if `say_hello` is later overridden, `greet` still uses the **original** implementation. `alias` copies by value at the time of aliasing.

### The Spaceship Operator `<=>`

Used for comparison and sorting. Returns `-1`, `0`, or `1`.

```ruby
1  <=> 10    # -1  (left is smaller)
10 <=> 10    #  0  (equal)
10 <=>  1    #  1  (left is larger)
```

```ruby
[3, 1, 2].sort { |a, b| a <=> b }    # [1, 2, 3]
```

💡 **Rails Connection:** `<=>` is used when implementing `Comparable` and in custom sorting scopes.

---

## 12. Flow Control

### if / elsif / else / end

```ruby
if x > 10
  puts "big"
elsif x > 5
  puts "medium"
else
  puts "small"
end
```

Note: **one `end`** closes the whole block.

### unless

`unless` = `if not`. Use when the condition is naturally expressed as a negative.

```ruby
unless x == 5
  puts "not five"
end
```

### One-liner (Postfix) Style

```ruby
puts "x is 5"    if x == 5         # postfix if
puts "not five"  unless x == 5     # postfix unless
```

💡 **Rails Connection:** Postfix conditions are idiomatic in controllers and models:
```ruby
redirect_to root_path and return if current_user.nil?
```

### Ternary

```ruby
x > 0 ? "positive" : "not positive"
```

### Logical Operators

Ruby has two sets with different precedence:

| Symbol | Word | Precedence |
|--------|------|-----------|
| `&&` | `and` | `&&` is **higher** |
| `\|\|` | `or` | `\|\|` is **higher** |
| `!` | `not` | `!` is higher |

⚠ **Pitfall:** `and`/`or` have **very low** precedence — lower than `=`. Use `&&`/`||` in almost all cases.

```ruby
x = true and false    # x = true  (and is evaluated AFTER =)
x = true && false     # x = false (correct)
```

### case / when

`case` returns a value — assign it directly.

```ruby
result = case
when y % 400 == 0 then true
when y % 100 == 0 then false
else y % 4 == 0
end
```

Match on a specific value:

```ruby
case status
when :active  then "User is active"
when :banned  then "User is banned"
else               "Unknown"
end
```

💡 **Rails Connection:** `case` with symbols is common in service objects and state machines.

---

## 13. Loops and Iterators

### while

```ruby
i = 0
while i < 5
  puts i
  i += 1
end

# Postfix style:
sq = sq * sq while sq < 1000
```

### for (rarely used in practice)

```ruby
for a in 1..4
  puts a
end
```

> Prefer `.each` over `for` — it's more idiomatic Ruby.

### times

```ruby
4.times do
  puts "MO"
end

5.times { |i| puts "Iteration #{i}" }    # i starts at 0
```

### each (preferred)

```ruby
[1, 2, 3].each { |n| puts n }

[1, 2, 3].each do |n|
  puts n
end
```

### Essential Iterators

```ruby
arr = [1, 2, 3, 4, 5]

arr.map    { |n| n * 2 }              # [2, 4, 6, 8, 10]   — transform every element
arr.select { |n| n > 2 }              # [3, 4, 5]           — keep matching elements
arr.reject { |n| n > 2 }              # [1, 2]              — discard matching elements
arr.find   { |n| n > 3 }              # 4                   — first match
arr.reduce(0) { |sum, n| sum + n }    # 15                  — accumulate into one value
arr.any?   { |n| n > 4 }              # true                — at least one matches?
arr.all?   { |n| n > 0 }              # true                — all match?
arr.none?  { |n| n > 10 }             # true                — none match?
arr.count  { |n| n > 2 }              # 3                   — count matches
```

💡 **Rails Connection:** These iterators are everywhere:
```ruby
@users.each   { |u| ... }           # in views
@orders.map   { |o| o.total }       # transform collections
@items.select { |i| i.active? }     # filter in-memory
```

---

## 14. Arrays

### Creation

```ruby
arr = [1, 2, 3]
arr = Array.new(3, 0)      # [0, 0, 0]

%w(mo ali sara)            # ["mo", "ali", "sara"]  ← word array shorthand
%i(red green blue)         # [:red, :green, :blue]  ← symbol array shorthand
```

### Access

```ruby
arr[0]         # first element
arr[-1]        # last element
arr[99]        # nil  (no IndexError — careful!)
arr.first      # first
arr.last       # last
arr.length     # size
```

### Common Mutations

```ruby
arr << 6           # push  (syntactic sugar for arr.push(6))
arr.push(7)        # same as <<
arr.pop            # removes and returns last element
arr.shift          # removes and returns first element
arr.unshift(0)     # prepends to front
arr.flatten        # flattens nested arrays
arr.uniq           # removes duplicates
arr.compact        # removes nil values
arr.sort           # sorted copy
arr.reverse        # reversed copy
```

💡 **Connection:** `<<` is a real method in Ruby, which is why Rails uses it naturally:
```ruby
errors << "is invalid"
```

---

## 15. Hashes

### Three Syntaxes (All Valid)

```ruby
hash = {"color" => "green"}     # string keys (legacy / rocket syntax)
hash = {:color => "green"}      # symbol keys (rocket syntax)
hash = {color: "green"}         # symbol keys (modern — preferred)
```

⚠ **Pitfall:** String keys and symbol keys are **not interchangeable**:
```ruby
hash = {"color" => "green"}
hash[:color]     # nil!   (symbol key ≠ string key)
hash["color"]    # "green"
```

### Access & Common Methods

```ruby
hash = {name: "Ahmed", age: 25}

hash[:name]                          # "Ahmed"
hash[:missing]                       # nil  (no error)
hash.keys                            # [:name, :age]
hash.values                          # ["Ahmed", 25]
hash.key?(:name)                     # true
hash.value?(25)                      # true
hash.each { |k, v| puts "#{k}: #{v}" }
hash.merge({city: "Cairo"})          # returns new hash
hash.merge!({city: "Cairo"})         # modifies in place
hash.map { |k, v| [k, v.to_s] }.to_h
hash.select { |k, v| v.is_a?(String) }
```

### Hash as Last Argument (Rails' Options Pattern)

When a hash is the **last argument**, curly braces can be omitted:

```ruby
def configure(options)
  # ...
end

configure(debug: true, timeout: 30)    # { } not needed!
```

💡 **Rails Connection:** This pattern is everywhere in Rails:
```ruby
render json: @user, status: :ok
validates :name, presence: true, length: { minimum: 2 }
belongs_to :user, optional: true
has_many :posts, dependent: :destroy
```

---

## 16. Blocks

### What is a Block?

A block is an **anonymous chunk of code** you pass to a method. It runs when the method calls it.

```
Method
  │
  └── Block  (extra behavior passed in)
```

### Two Syntaxes

```ruby
# Single line — use { }
[1, 2, 3].each { |n| puts n }

# Multi-line — use do...end
[1, 2, 3].each do |n|
  puts n
end
```

### Block Variables (the `|x|` part)

```ruby
5.times { |x| puts "x is #{x}" }
# |x| is a block-local variable
# Ruby automatically passes the current count into x
# Starts at 0
```

### Blocks Capture Outer Scope (Closures)

```ruby
message = "hello"
3.times { puts message }    # works! message is accessible inside the block
```

### yield — Calling a Block from Inside a Method

```ruby
def greet
  puts "Before"
  yield "World" if block_given?
  puts "After"
end

greet { |name| puts "Hello, #{name}" }
# Before
# Hello, World
# After
```

💡 **Rails Connection:** Blocks are central to Rails:
```ruby
# Routes
Rails.application.routes.draw do
  resources :users
  root "pages#home"
end

# ActiveRecord scopes
scope :active, -> { where(active: true) }

# View helpers
<%= form_with model: @user do |f| %>
  <%= f.text_field :name %>
<% end %>

# Callbacks
before_action :authenticate_user!, only: [:create, :destroy]
```

---

## 17. Exception Handling

```ruby
begin              # equivalent to try
  Integer("abc")
rescue ArgumentError => e
  puts "Caught: #{e.message}"
rescue => e        # catches any StandardError
  puts "Something went wrong: #{e.message}"
ensure
  puts "This always runs"   # equivalent to finally
end
```

```
begin   →  try
rescue  →  catch
ensure  →  finally
```

### raise

```ruby
raise "Something went wrong"
raise ArgumentError, "Invalid input"
```

💡 **Rails Connection:**
- `save!` / `create!` raise `ActiveRecord::RecordInvalid` on failure
- Controllers use `rescue_from` to handle exceptions globally:

```ruby
class ApplicationController < ActionController::Base
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  private

  def not_found
    render json: { error: "Not found" }, status: 404
  end
end
```

---

## 18. Classes and Objects

### Class Definition

```ruby
class Dog               # PascalCase — always
  def initialize(name)  # constructor
    @name = name        # instance variable — accessible only within this object
  end

  def bark
    puts "Woof!"
  end

  def name              # manual getter
    @name
  end

  def name=(new_name)   # manual setter — note: name= is a valid method name!
    @name = new_name
  end
end

dog = Dog.new("Rocky")
dog.bark                  # Woof!
dog.name = "Max"          # calls name=(new_name) — syntactic sugar!
puts dog.name             # Max
```

```
Class Dog
  │
  ├── initialize  (constructor — called by Dog.new)
  ├── @name       (instance variable — private to each object)
  └── Methods     (public by default)
```

### self

`self` always refers to the **current object**, but *which* object depends on context:

```ruby
class Dog
  def who_am_i
    self    # here, self = the Dog instance
  end
end

# Inside class body (outside methods):
# self = the Dog class itself
```

| Context | `self` refers to |
|---------|-----------------|
| Inside instance method | The instance (the object) |
| Inside class body / class method | The class itself |

---

## 19. Getters and Setters

Writing manual getters and setters is verbose. Ruby provides clean shortcuts:

```ruby
class Dog
  attr_reader   :name           # getter only
  attr_writer   :name           # setter only
  attr_accessor :name           # getter + setter
  attr_accessor :name, :breed   # multiple at once
end
```

These replace:

```ruby
def name; @name; end               # attr_reader
def name=(val); @name = val; end   # attr_writer
```

💡 **Rails Connection:** `attr_accessor` is used extensively in:
- Form objects (non-database attributes)
- Non-ActiveRecord models
- ActiveRecord handles database column accessors automatically

---

## 20. Inheritance

```ruby
class Animal
  def initialize(name)
    @name = name
  end

  def speak
    puts "..."
  end
end

class Dog < Animal         # Dog inherits from Animal
  def initialize(name, breed)
    super(name)            # calls Animal's initialize with name
    @breed = breed
  end

  def speak                # override the parent method
    puts "Woof!"
  end
end

dog = Dog.new("Rocky", "Husky")
dog.speak    # Woof!
```

```
Animal
  │
  └── Dog
        ├── inherits: initialize (then extends it)
        └── overrides: speak
```

### super Variants

```ruby
super           # calls parent method with the same arguments automatically
super(a, b)     # calls parent method with explicit arguments
super()         # calls parent method with NO arguments
```

### No Method Overloading

Ruby does **not** support overloading. Defining the same method twice replaces the first:

```ruby
def greet(name)
  puts "hello #{name}"
end

def greet              # this REPLACES the previous greet
  puts "hello"
end
```

Use default parameters and `*args` to handle varying inputs instead.

💡 **Rails Connection:** Inheritance is the backbone of Rails:
```ruby
class User < ApplicationRecord         # inherit from AR base
class UsersController < ApplicationController   # inherit from controller base
```

---

## 21. Access Control

```ruby
class Person
  def public_method          # public by default — callable from anywhere
    "anyone can call this"
  end

  private

  def private_method         # only callable from inside this class
    "internal use only"
  end

  protected

  def protected_method       # callable from this class AND subclasses
    "semi-internal"
  end
end
```

```
public     → callable from anywhere
private    → callable only from within the class
protected  → callable within the class and its subclasses
```

⚠ **Different from other languages:** Ruby's `protected` is NOT the same as Java/PHP `protected`. In Ruby, `protected` allows calling the method on **any instance of the same class** (not just `self`). It's mainly used for comparison methods:

```ruby
def >(other)
  @value > other.value   # other.value is protected, but accessible here
end
```

---

## 22. Class Variables and Class Methods

### Class Variables (`@@`)

Shared across **all instances** of a class.

```ruby
class Dog
  @@count = 0

  def initialize(name)
    @name = name
    @@count += 1
  end

  def self.count    # class method — called on Dog, not on an instance
    @@count
  end
end

Dog.new("Rocky")
Dog.new("Max")
Dog.count    # 2
```

```
Class Dog
  │
  ├── @@count       (class variable — shared by ALL instances)
  ├── self.count    (class method — called as Dog.count)
  │
  └── Each Dog instance:
        └── @name   (instance variable — unique per object)
```

### Class Methods vs Instance Methods

```ruby
Dog.count       # class method   — called on the class
dog.bark        # instance method — called on an instance
```

💡 **Rails Connection:** Class methods are everywhere in ActiveRecord:
```ruby
User.find(1)
User.where(active: true)
User.count
User.first
```

---

## 23. Modules

### What is a Module?

A **container** — groups related classes, methods, and constants to avoid name conflicts.

```ruby
module Animals
  class Dog
    def bark
      puts "Woof!"
    end
  end

  class Cat
    def meow
      puts "Meow!"
    end
  end
end

dog = Animals::Dog.new
dog.bark    # Woof!
```

```
Module Animals
  │
  ├── Class Dog    (accessed as Animals::Dog)
  └── Class Cat    (accessed as Animals::Cat)
```

### Two Roles of Modules

```
Module
  │
  ├── Namespace   (organize code, prevent name conflicts)
  └── Mixin       (share behavior across multiple classes)
```

---

## 24. Mixins

### What is a Mixin?

A way to **share methods across unrelated classes** without inheritance.

Ruby supports only **single inheritance** (one parent class). Mixins let you pull in behavior from multiple sources.

```ruby
module Swimmable
  def swim
    puts "#{self.class} is swimming!"
  end
end

module Flyable
  def fly
    puts "#{self.class} is flying!"
  end
end

class Duck
  include Swimmable
  include Flyable
end

class Dog
  include Swimmable
end

Duck.new.swim    # Duck is swimming!
Duck.new.fly     # Duck is flying!
Dog.new.swim     # Dog is swimming!
```

```
Swimmable module
  │
  ├── included in Duck  →  duck.swim works
  └── included in Dog   →  dog.swim works

Flyable module
  │
  └── included in Duck  →  duck.fly works
```

### include vs extend

```ruby
include ModuleName    # adds module methods as instance methods
extend  ModuleName    # adds module methods as class methods
```

### Comparison to PHP

| PHP | Ruby |
|-----|------|
| `trait Swimmable` | `module Swimmable` |
| `use Swimmable` | `include Swimmable` |

💡 **Rails Connection:** Modules as Concerns are a Rails standard pattern:

```ruby
# app/models/concerns/searchable.rb
module Searchable
  extend ActiveSupport::Concern

  included do
    scope :search, ->(q) { where("name LIKE ?", "%#{q}%") }
  end
end

class User < ApplicationRecord
  include Searchable   # User.search("Ali") now works
end
```

---

## 25. Ruby Conventions

| Convention | Rule | Example |
|-----------|------|---------|
| Variables & methods | `snake_case` | `user_name`, `find_by_email` |
| Classes & Modules | `PascalCase` | `UserProfile`, `Swimmable` |
| Constants | `SCREAMING_SNAKE_CASE` | `MAX_RETRIES`, `API_KEY` |
| Boolean methods | Suffix `?` | `valid?`, `empty?`, `logged_in?` |
| Destructive methods | Suffix `!` | `save!`, `sort!`, `upcase!` |
| Unused variables | Prefix `_` | `_unused`, `_` |

### Idiomatic Ruby Prefers

- `attr_accessor` over manual getters/setters
- `.each` over `for` loops
- Postfix `if`/`unless` for readable one-liners
- `{}` for single-line blocks, `do...end` for multi-line
- Omit `return` (rely on implicit return)
- Omit parentheses for simple method calls with no ambiguity
- Single quotes when no interpolation needed

---

## 26. Common Beginner Pitfalls

⚠ **Falsy Values — Only Two**

```ruby
# Only these are falsy in Ruby:
nil
false

# EVERYTHING else is truthy — including:
0        # truthy!
""       # truthy!
[]       # truthy!
{}       # truthy!
```

Coming from JavaScript/PHP/Python, this will catch you. Check for `nil?` or `.empty?` explicitly.

---

⚠ **`..` vs `...` in Ranges**

```ruby
(1..5).to_a     # [1, 2, 3, 4, 5]   — includes 5
(1...5).to_a    # [1, 2, 3, 4]      — excludes 5
```

---

⚠ **String Keys vs Symbol Keys in Hashes**

```ruby
hash = {"name" => "Ahmed"}
hash[:name]      # nil!    ← symbol ≠ string key
hash["name"]     # "Ahmed" ← correct
```

---

⚠ **`!` Methods vs `?` Methods — Don't Confuse**

```ruby
a = "hello"
a.capitalize?    # NoMethodError — ? just means boolean, it's not automatically created
a.include?("e")  # true — this method EXISTS
a.capitalize!    # modifies a in place
```

---

⚠ **No Method Overloading**

```ruby
def greet(name); end
def greet; end         # silently REPLACES the first definition
```

---

⚠ **`and`/`or` Have Very Low Precedence**

```ruby
x = true and false     # x = true  (and evaluated after =)
x = true && false      # x = false (correct)
```

Always use `&&` and `||` in conditions.

---

⚠ **Missing `end` Keywords**

Every `if`, `def`, `class`, `module`, `do...end` needs a closing `end`. Missing one causes a `SyntaxError` — often pointing to the wrong line.

---

⚠ **`self` Changes Meaning by Context**

```ruby
class Dog
  self         # = the Dog class (class-level context)

  def bark
    self       # = the Dog instance (instance-level context)
  end
end
```

---

## 27. Rails-Relevant Ruby Concepts

A prioritized guide to what matters most when moving to Rails.

### 🔴 Frequently Used in Rails

| Ruby Concept | Why It Matters in Rails |
|-------------|------------------------|
| Symbols | Keys in `params[:name]`, render options, validations, associations |
| Hashes | `params`, option hashes, `render`, `redirect_to` |
| Blocks | Routes, callbacks, scopes, view helpers, form builders |
| Classes | Every model, controller, mailer, job is a class |
| Inheritance | `< ApplicationRecord`, `< ApplicationController` |
| Modules / Mixins | Concerns — the standard way to share model/controller logic |
| `attr_accessor` | Form objects, non-DB models, virtual attributes |
| Bang methods (`!`) | `save!`, `create!`, `update!`, `destroy!` |
| Implicit return | Cleaner method bodies throughout |
| `self` (class methods) | Scopes, finders, factory methods |

### 🟡 Sometimes Used in Rails

| Ruby Concept | Where in Rails |
|-------------|---------------|
| Ranges | `validates :age, in: 18..65`, date queries |
| `*args` | Flexible method signatures in helpers and service objects |
| Exception handling | `rescue_from` in controllers, service objects |
| `<=>` | Custom sorting, `Comparable` module |
| `alias` / `alias_method` | Overriding behavior in gems, DSL design |
| `case/when` | State machine patterns, routing logic |

### 🟢 Rarely Needed in Rails (but good to understand)

| Ruby Concept | Note |
|-------------|------|
| `for` loops | Always use `.each` instead |
| Global variables `$` | Almost never appropriate |
| `=begin...=end` | Use `#` single-line comments instead |
| Class variables `@@` | Prefer class instance variables in Rails |
| `protected` | Mainly for comparison patterns |

---

## 28. Ruby Cheat Sheet

A fast 5-minute revision reference.

---

### Running Ruby

```bash
# --- asdf version management ---
asdf plugin add ruby                   # add Ruby support
asdf install ruby latest               # install latest Ruby
asdf install ruby 4.0.5               # install specific version
asdf list ruby                         # list installed versions
asdf global ruby 4.0.5                # set global version (use actual version number)
asdf local ruby 4.0.5                 # set local version (creates .tool-versions)
asdf current ruby                      # check active version
asdf reshim ruby                       # rebuild shims after gem installs

# --- running code ---
ruby file.rb                           # run a file
ruby --version                         # confirm active Ruby version

# --- interactive shell ---
gem install pry                        # install pry (once)
pry                                    # launch interactive shell

# --- documentation ---
ri String                              # docs for a class
ri String#upcase                       # docs for a specific method
```

---

### Variables

```ruby
local_var   = "value"      # local
$global_var = "value"      # global (avoid)
@instance   = "value"      # instance (inside class)
@@class_var = "value"      # class (shared across all instances)
CONSTANT    = 42           # constant
```

---

### Methods

```ruby
def greet(name = "World", *extras)
  "Hello, #{name}"          # implicit return
end

greet                       # "Hello, World"
greet("Ahmed")              # "Hello, Ahmed"

alias hi greet              # hi copies greet's current implementation
```

---

### Conditions

```ruby
if x > 0
  "positive"
elsif x == 0
  "zero"
else
  "negative"
end

unless x.nil?               # if not nil
  "has value"
end

puts "ok" if x == 5         # postfix if
puts "ok" unless x.nil?     # postfix unless

x > 0 ? "pos" : "neg"       # ternary

case status
when :active  then "Active"
when :banned  then "Banned"
else               "Unknown"
end
```

---

### Loops & Iterators

```ruby
while x < 10; x += 1; end

5.times  { |i| puts i }
1.upto(5){ |i| puts i }
arr.each { |el| puts el }

arr.map    { |el| el * 2 }         # transform
arr.select { |el| el > 2 }         # keep
arr.reject { |el| el > 2 }         # discard
arr.find   { |el| el > 2 }         # first match
arr.reduce(0) { |sum, n| sum + n }  # accumulate
arr.any?   { |el| el > 4 }
arr.all?   { |el| el > 0 }
arr.none?  { |el| el > 10 }
```

---

### Arrays

```ruby
arr = [1, 2, 3]
%w(a b c)               # ["a", "b", "c"]
%i(a b c)               # [:a, :b, :c]

arr << 4                # push
arr.push(4)             # same
arr.pop                 # remove last
arr.shift               # remove first
arr.unshift(0)          # prepend
arr.first / arr.last
arr.length / arr.size
arr.include?(2)         # true/false
arr.flatten / arr.uniq / arr.compact
arr.sort / arr.reverse
```

---

### Hashes

```ruby
h = {name: "Ahmed", age: 25}   # symbol keys (preferred)
h[:name]                        # "Ahmed"
h[:missing]                     # nil (no error)
h.keys / h.values
h.key?(:name) / h.value?(25)
h.each { |k, v| puts "#{k}: #{v}" }
h.merge({city: "Cairo"})        # new hash
h.merge!({city: "Cairo"})       # in place
h.map { |k, v| [k, v.to_s] }.to_h
h.select { |k, v| v.is_a?(String) }
```

---

### Blocks

```ruby
# Inline
[1,2,3].each { |n| puts n }

# Multi-line
[1,2,3].each do |n|
  puts n
end

# yield
def run
  yield 42 if block_given?
end
run { |x| puts x }     # 42
```

---

### Classes

```ruby
class Animal
  attr_accessor :name
  @@count = 0

  def initialize(name)
    @name = name
    @@count += 1
  end

  def self.count; @@count; end    # class method

  private

  def secret; "internal"; end
end

a = Animal.new("Leo")
a.name          # getter
a.name = "Max"  # setter
Animal.count    # class method → 1
```

---

### Inheritance

```ruby
class Dog < Animal
  def initialize(name, breed)
    super(name)
    @breed = breed
  end

  def speak
    "Woof!"
  end
end

d = Dog.new("Rocky", "Husky")
d.speak    # "Woof!"
```

---

### Modules & Mixins

```ruby
# Namespace
module MyApp
  class Runner; end
end
MyApp::Runner.new

# Mixin
module Greetable
  def greet
    "Hello, I am #{name}"
  end
end

class Person
  include Greetable
  attr_reader :name
  def initialize(name); @name = name; end
end

Person.new("Ahmed").greet    # "Hello, I am Ahmed"
```

---

### Exception Handling

```ruby
begin
  raise ArgumentError, "bad input"
rescue ArgumentError => e
  puts "Caught: #{e.message}"
rescue => e
  puts "Error: #{e.message}"
ensure
  puts "Always runs"
end
```

---

### Symbols & Ranges

```ruby
:name.class       # Symbol
:name == :name    # true (same object)

(1..5).to_a       # [1, 2, 3, 4, 5]    inclusive
(1...5).to_a      # [1, 2, 3, 4]       exclusive
(1..5).include?(3) # true
```

---

### Common Conventions at a Glance

```ruby
method?           # returns boolean
method!           # destructive or raises

snake_case        # methods and variables
PascalCase        # classes and modules
SCREAMING_SNAKE   # constants

a.upcase          # non-destructive — returns new string
a.upcase!         # destructive — modifies a

puts x if y       # postfix if
puts x unless y   # postfix unless
```

---

*End of Ruby Fundamentals Guide*
*Next step: Ruby on Rails — where all of this comes together.*
