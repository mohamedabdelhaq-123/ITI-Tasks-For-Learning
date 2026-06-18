print "HI how many scores?"
n = gets.to_i
sum=0
for i in 1..n
    print "Enter Score #{i}: " # print for no new line
    score= gets.to_i
    sum+=score
    max=min=sum if i==1
    max=score if max<score
    min=score if min>score

end
avg =(sum.to_f/n)
grade=0
if avg<60
  grade="F"
elsif avg>=60 and avg<=69
  grade="D"
elsif avg>=70 and avg<=79
  grade="C"
elsif avg>=80 and avg<=89
  grade="B"
elsif avg>=90 and avg<=100
  grade="A"
else 
  puts "Wrong Calculation"
end

puts "Results: "
puts "\tAverage: #{avg}"
puts "\tGrade: #{grade}"
puts "\tHighest: #{max}"
puts "\tLowest: #{min}"
