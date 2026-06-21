from pydantic import BaseModel
class Person:
    def __init__(self, name ,age):
        self.name = name
        self.age = age

class PersonModel(BaseModel):
    name:str
    age: int

p = Person("claude" ,5)
p2= Person("claude2" ,"three")
p3 = PersonModel(name="claude", age=3)


print(p.name)
print(p2.name)
print(p3)