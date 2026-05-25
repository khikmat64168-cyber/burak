########### M-TASK ##############

def getSquareNumbers(numbers):
  return [{"raqamlar": n , "kvadrati": n ** 2 } for n in numbers]

print(getSquareNumbers({1, 2, 3, 4, 5}))



'''  
########### L-TASK ##############

def reverseSentence(gapp):
  sozlar = gapp.split(" ")
  reversed_sozlar = [word[::-1] for word in sozlar]
  return " ".join(reversed_sozlar)


print(reverseSentence("we like coding!"))
print(reverseSentence("anduril completed the target "))


 '''