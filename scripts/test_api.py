import urllib.request
import json

url = 'https://bps-ai-backend.vercel.app/api/v1/chat'
data = {'query': 'berapa jumlah penduduk miskin di sulawesi tengah tahun 2023?'}
headers = {'Content-Type': 'application/json'}

req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        print(f"STATUS: {result.get('status')}")
        print(f"RESPONSE: {result.get('response_text')}")
        print(f"CITATIONS: {json.dumps(result.get('citations', []), indent=2)}")
except Exception as e:
    print(f"ERROR: {e}")
