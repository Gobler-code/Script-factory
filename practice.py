
import requests
disaster = {
    "name": "Chernobyl",
    "year": 1986,
    "country" :"Ukraine"
}
print(disaster["name"])

for disasters in disaster :
    print(disaster)

if( disaster["year"]>2000):
    print("modern disaster")
else:
    print("old disaster")

try:
    response = requests.get("https://example.com")
    print(response.text)
except Exception as e:
    print(e)