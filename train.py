########### Y -TASK ##############

def findIntersection(errey1, errey2):
  return list(set(errey1) & set(errey2))

print(findIntersection([1,2,3],[3,2,0]))



'''
########### X -TASK ##############
def countOccurences(obyekt, key):
  count = 0
  
  if isinstance(obyekt, dict): 
    for a, b in obyekt.items():
      if a == key:
        count += 1
      count += countOccurences(b, key)
  elif isinstance(obyekt, list):
    for item in obyekt:
      count += countOccurences(item, key) 
  
  return count


print(countOccurences({"model": "A", "s": {"model": "B"}}, "model"))




########### W -TASK ##############

def chunk_array(array, uzunligi):
  result = []
  for a in range(0, len(array), uzunligi):
    result.append(array[a:a + uzunligi])
  return result

print(chunk_array([1, 2, 3, 4, 5], 2))









########### V -TASK ##############

def countChars(stringimiz):
  result = {}
  for harf in stringimiz:
    result[harf] = result.get(harf, 0) + 1
  return result
  
print(countChars("hello"))
print(countChars("salom"))




. 
########### T-TASK ##############

def mergeSortedArrays(brinchi, ikinchi):
  birlashgani = brinchi + ikinchi
  return sorted(birlashgani)

print(mergeSortedArrays([0, 3, 4], [4, 6]))





########### S-TASK ##############

def missingNumber(nomerla):
  n = len(nomerla)
  formulasi_misolli = n * (n + 1) // 2
  aniq_natijasi = sum(nomerla)
  return formulasi_misolli - aniq_natijasi

print(missingNumber([3, 0, 1]))






########### R-TASK ##############

def calculate(stringHisoblidigan: str) -> int:
  boleklari = stringHisoblidigan.split()
  a = int(boleklari[0])
  amalgaOshiradigan = boleklari[1]
  b = int(boleklari[2])
  
  if amalgaOshiradigan =="+":
    return a + b
  elif amalgaOshiradigan == "-":
    return a - b
  elif amalgaOshiradigan == "*":
    return a * b
  elif amalgaOshiradigan == "/":
    return a // b 

print(calculate("1 + 3"))











########### Q-TASK ##############
def hasProperty (obj, propertisi):
  return propertisi in obj

print(hasProperty({ "name": "BMW" }, "name"))
print(hasProperty({ "name": "BMW" }, "number"))



########### P-TASK ##############

def objectToArray(sonlar):
  return  [list(item) for item in sonlar.items()]

print(objectToArray({ "a": 10, "b": 20 }))



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