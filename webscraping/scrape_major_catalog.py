#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
from time import sleep
import re

base_url = 'https://catalog.unl.edu'

# majors_data.json retrieved from the allItemsData variable in local JS
# in this page: https://catalog.unl.edu/undergraduate/majors/
with open('majors_data.json', 'r') as f:
    majors_data = json.load(f)

majors_links = [major['url'] for major in list(majors_data.values())]

for link in majors_links:
    # this is just the name of the major e.g. Computer Science
    # major = ' '.join(word.capitalize() for word in link.split('/')[-2].split('-'))

    response = requests.get(base_url + link)
    if not response.ok:
        print(f'error on request for {link}')
        continue
    soup = BeautifulSoup(response.text, 'html.parser')
    major_title_container = soup.find('h1', class_='page-title')
    major_text_container = soup.find(id='majortextcontainer')
    if not major_title_container or not major_text_container:
        continue
    major_title = re.split(r'\s{2,}', major_title_container.text)[1]
    major_text = major_text_container.text
    string = 'MAJOR NAME: ' + major_title + '\n\n' + major_text
    print(f'writing data for {major_title}...')
    with open(f'{major_title}.txt', 'w') as f:
        f.write(string)
