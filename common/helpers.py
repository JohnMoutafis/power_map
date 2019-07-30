def create_year_range(start_year: int, end_year: int):
    """Creates a year range list from a start and end year."""
    year_range = []
    while end_year not in year_range:
        if year_range:
            year_range.append(year_range[-1] + 1)
        else:
            year_range.append(start_year)
    return [str(year) for year in year_range]
