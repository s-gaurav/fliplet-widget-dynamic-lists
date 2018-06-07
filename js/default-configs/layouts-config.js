window.flListLayoutConfig = {
  'small-card': {
    'filtersEnabled': true,
    'filterFields': ['Location', 'Sectors', 'Expertize'],
    'searchEnabled': true,
    'searchFields': ['First Name', 'Last Name', 'Title'],
    'sortOptions': [
      {
        'column': 'First Name',
        'columns': ['First Name', 'Last Name', 'Title', 'Location', 'Image', 'Email', 'Telephone', 'Bio', 'Sectors', 'Expertize'],
        'id': 'ajdmjZrT',
        'orderBy': 'ascending',
        'sortBy': 'alphabetical',
        'title': 'First Name - Alphabetical - Ascending'
      }
    ],
    'style-specific': ['list-filter', 'list-search']
  },
  'news-feed': {
    'filtersEnabled': true,
    'filterFields': ['Categories'],
    'searchEnabled': false,
    'searchFields': [],
    'sortOptions': [
      {
        'column': 'Date',
        'columns': ['Title', 'Date', 'Categories', 'Image', 'Content'],
        'id': 'ajdmjZrT',
        'orderBy': 'descending',
        'sortBy': 'date',
        'title': 'Date - Date - Descending'
      }
    ],
    'social': {
      'likes': true
    },
    'style-specific': ['list-filter', 'list-likes']
  }
}