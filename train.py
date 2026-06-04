########### P-TASK ##############

def objectToArray(sonlar):
  return  [list(item) for item in sonlar.items()]

print(objectToArray({ "a": 10, "b": 20 }))


'''
########### O-TASK ##############
def calculateSumOfNumbers(nomerlar):
  return sum(el for el in nomerlar if isinstance(el, (int, float))and not isinstance(el, bool))

print(calculateSumOfNumbers([10, "10", {"son": 10}, True, 35]))




########### N-TASK ##############

def palindromCheck(string):
  return string == string[::-1]


print(palindromCheck("dad"))
print(palindromCheck("arra"))

print(palindromCheck("ikki"))

print(palindromCheck("cool"))














########### M-TASK ##############

def getSquareNumbers(numbers):
  return [{"raqamlar": n , "kvadrati": n ** 2 } for n in numbers]

print(getSquareNumbers({1, 2, 3, 4, 5}))




########### L-TASK ##############

def reverseSentence(gapp):
  sozlar = gapp.split(" ")
  reversed_sozlar = [word[::-1] for word in sozlar]
  return " ".join(reversed_sozlar)


print(reverseSentence("we like coding!"))
print(reverseSentence("anduril completed the target "))


 '''