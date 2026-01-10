import requests
from bs4 import BeautifulSoup
import re

def scrape_wikipedia(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # Title
        title = soup.find('h1', {'id': 'firstHeading'}).text.strip()

        # Summary (first paragraph)
        summary_p = soup.find('div', {'id': 'mw-content-text'}).find('p', recursive=False)
        summary = summary_p.text.strip() if summary_p else ""

        # Sections
        sections = []
        for header in soup.find_all(['h2', 'h3']):
            if header.get('id') and not header.get('id').startswith('toc'):
                sections.append(header.text.strip().replace('[edit]', ''))

        # Key entities (simple extraction)
        content_text = soup.get_text()
        # People: capitalized words
        people = list(set(re.findall(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', content_text)))
        # Organizations: similar
        organizations = []
        # Locations: countries etc.
        locations = []

        key_entities = {
            "people": people[:10],  # limit
            "organizations": organizations,
            "locations": locations
        }

        return {
            "title": title,
            "summary": summary,
            "key_entities": key_entities,
            "sections": sections,
            "content": content_text,
            "raw_html": str(soup)
        }
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None