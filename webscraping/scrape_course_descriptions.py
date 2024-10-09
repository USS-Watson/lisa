#!/usr/bin/env python3
import requests
import xml.etree.ElementTree as ET
import json
import urllib
import re
import os

endpoint = 'https://catalog.unl.edu/ribbit/index.cgi?page=getcourse.rjs&code='

# fall2024.json is a json of all UNL fall 2024 courses available
# retrieved from '/api/terms/FALL 2024' at https://unl.collegescheduler.com
# (logged in as a UNL student)
with open('fall2024.json', 'r') as f:
    fall2024 = json.load(f)

result_json = []
result_string = [] # ok I know it's not a string rn but it will be later bro trust
print(f'grabbing descriptions for {len(fall2024)} courses')

try:
    for i, course in enumerate(fall2024):
        print(f'{i} - ', end='')
        course_id = course['id'].replace('|', ' ')
        response = requests.get(endpoint + urllib.parse.quote(course_id))
        if not response.ok:
            print(f'error retrieving data for course {course_id}')
            continue
        root = ET.fromstring(response.text)
        cdata = root.find('course')
        if cdata is None:
            print(f'error in response for course {course_id}')
        description_match = re.search(r"<p class='courseblockdesc noindent'><strong>Description:</strong>(.*?)</p>", cdata.text)
        if not description_match:
            print(f'couldn\'t find description for course {course_id}')
            continue
        description = description_match.group(1).strip()
        print(f'retrieved description for course {course_id}')
        output = {}
        output['id'] = course_id
        output['description'] = description
        result_json.append(output)
        result_string.append(f'{course_id} - {description}')
except:
    pass

result_string = '\n'.join(result_string) + '\n'

if not os.path.exists('course-description.json'):
    with open('course-descriptions.json', 'w') as f:
        f.write(json.dumps(result_json))
if not os.path.exists('course-description.txt'):
    with open('course-descriptions.txt', 'w') as f:
        f.write(result_string)
print('written output to course-descriptions.{json,txt}')
